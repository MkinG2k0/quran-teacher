'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { getOfflineBundleSync } from '@/shared/lib/offline-program'
import {
	getCompletedStepIds,
	subscribeProgress,
} from '@/shared/lib/student-progress-storage'
import {
	getSavedHomePage,
	setHomeScroll,
	setSavedHomePage,
} from '@/shared/lib/student-ui-state-storage'
import { useHomeWindowScroll } from '@/shared/lib/use-persisted-scroll'
import { StepLessonView } from '@/widgets/step-lesson'

import { STEPS_PER_SECTION } from '../lib/step-sections'
import {
	useCurrentProgramStep,
	useProgramStepsPage,
} from '../model/use-program-steps-page'
import { StudentHome } from './StudentHome'

function getOpenStepIdFromUrl(): number | null {
	if (typeof window === 'undefined') return null

	const fromQuery = new URLSearchParams(window.location.search).get('step')
	if (fromQuery) {
		const id = Number(fromQuery)
		if (Number.isInteger(id) && id > 0) return id
	}

	return null
}

export function StudentHomeWithProgress() {
	const [activeStepId, setActiveStepId] = useState<number | null>(null)
	const [completedIds, setCompletedIds] = useState<number[]>([])
	const [page, setPage] = useState(() => getSavedHomePage() ?? 1)
	const initialPageSet = useRef(getSavedHomePage() != null)

	useEffect(() => {
		setCompletedIds(getCompletedStepIds())
		return subscribeProgress(() => {
			setCompletedIds(getCompletedStepIds())
		})
	}, [])

	const { data: currentStep } = useCurrentProgramStep(completedIds)
	const { data: stepsPage, isLoading } = useProgramStepsPage(
		page,
		completedIds,
		currentStep?.id,
	)

	const totalPublished =
		stepsPage?.totalPublished ??
		getOfflineBundleSync()?.totalPublished ??
		0

	useEffect(() => {
		if (!currentStep || initialPageSet.current) return
		initialPageSet.current = true
		const stepPage = Math.ceil(currentStep.order / STEPS_PER_SECTION)
		setPage(stepPage)
		setSavedHomePage(stepPage)
	}, [currentStep])

	useHomeWindowScroll(page, !isLoading && activeStepId === null)

	const handlePageChange = (nextPage: number) => {
		setHomeScroll(page, window.scrollY)
		setSavedHomePage(nextPage)
		setPage(nextPage)
	}

	const handleOpenStep = useCallback((stepId: number) => {
		setActiveStepId(stepId)
		window.history.pushState({ stepId }, '', `/?step=${stepId}`)
	}, [])

	const handleCloseStep = useCallback(() => {
		setActiveStepId(null)
		window.history.pushState(null, '', '/')
	}, [])

	useEffect(() => {
		const initial = getOpenStepIdFromUrl()
		if (initial) setActiveStepId(initial)

		const onPopState = () => setActiveStepId(getOpenStepIdFromUrl())
		window.addEventListener('popstate', onPopState)
		return () => window.removeEventListener('popstate', onPopState)
	}, [])

	return (
		<>
			<StudentHome
				userName="Ученик"
				totalPublished={totalPublished}
				completedCount={completedIds.length}
				currentStep={currentStep ?? null}
				steps={stepsPage?.steps ?? []}
				page={stepsPage?.page ?? page}
				totalPages={stepsPage?.totalPages ?? 1}
				isLoadingSteps={isLoading}
				onPageChange={handlePageChange}
				onOpenStep={(step) => handleOpenStep(step.id)}
			/>
			{activeStepId !== null && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 50,
						background: '#0D1117',
					}}
				>
					<StepLessonView
						stepId={activeStepId}
						onClose={handleCloseStep}
						onOpenStep={handleOpenStep}
					/>
				</div>
			)}
		</>
	)
}

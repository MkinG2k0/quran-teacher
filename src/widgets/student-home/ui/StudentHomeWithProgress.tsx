'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useStepNav } from '@/features/step-navigation'
import { getProgramBundleSync } from '@/shared/lib/offline-program'
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

import { STEPS_PER_SECTION } from '../lib/step-sections'
import {
	useCurrentProgramStep,
	useProgramStepsPage,
} from '../model/use-program-steps-page'
import { StudentHome } from './StudentHome'

export function StudentHomeWithProgress() {
	const { openStep } = useStepNav()
	const [completedIds, setCompletedIds] = useState<number[]>([])
	const [page, setPage] = useState(() => getSavedHomePage() ?? 1)
	const initialPageSet = useRef(getSavedHomePage() != null)

	useEffect(() => {
		setCompletedIds(getCompletedStepIds())
		return subscribeProgress(() => {
			setCompletedIds(getCompletedStepIds())
		})
	}, [])

	useEffect(() => {
		const fromQuery = new URLSearchParams(window.location.search).get('step')
		if (!fromQuery) return
		const id = Number(fromQuery)
		if (Number.isInteger(id) && id > 0) {
			openStep(id)
		}
	}, [openStep])

	const { data: currentStep } = useCurrentProgramStep(completedIds)
	const { data: stepsPage, isLoading } = useProgramStepsPage(
		page,
		completedIds,
		currentStep?.id,
	)

	const totalPublished =
		stepsPage?.totalPublished ??
		getProgramBundleSync()?.totalPublished ??
		0

	useEffect(() => {
		if (!currentStep || initialPageSet.current) return
		initialPageSet.current = true
		const stepPage = Math.ceil(currentStep.order / STEPS_PER_SECTION)
		setPage(stepPage)
		setSavedHomePage(stepPage)
	}, [currentStep])

	useHomeWindowScroll(page, !isLoading)

	const handlePageChange = (nextPage: number) => {
		setHomeScroll(page, window.scrollY)
		setSavedHomePage(nextPage)
		setPage(nextPage)
	}

	const handleOpenStep = useCallback(
		(stepId: number) => {
			openStep(stepId)
		},
		[openStep],
	)

	return (
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
	)
}

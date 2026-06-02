'use client'

import { useEffect, useRef, useState } from 'react'

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

interface StudentHomeWithProgressProps {
	totalPublished: number
}

export function StudentHomeWithProgress({
	totalPublished,
}: StudentHomeWithProgressProps) {
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
		/>
	)
}

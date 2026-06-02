'use client'

import { useEffect, useRef, useState } from 'react'

import {
	getCompletedStepIds,
	subscribeProgress,
} from '@/shared/lib/student-progress-storage'

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
	const [completedIds, setCompletedIds] = useState(getCompletedStepIds)
	const [page, setPage] = useState(1)
	const initialPageSet = useRef(false)

	useEffect(() => {
		return subscribeProgress(() => {
			setCompletedIds(getCompletedStepIds())
		})
	}, [])

	const { data: currentStep } = useCurrentProgramStep(completedIds)
	const { data: stepsPage, isLoading } = useProgramStepsPage(page, currentStep?.id)

	useEffect(() => {
		if (!currentStep || initialPageSet.current) return
		initialPageSet.current = true
		setPage(Math.ceil(currentStep.order / STEPS_PER_SECTION))
	}, [currentStep])

	const handlePageChange = (nextPage: number) => {
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

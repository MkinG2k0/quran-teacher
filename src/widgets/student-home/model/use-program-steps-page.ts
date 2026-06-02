'use client'

import { useQuery } from '@tanstack/react-query'

import { fetchCurrentStep, fetchStepsPage, stepKeys } from '@/entities/step'
import type { StepListItem } from '@/entities/step'
import { applyProgressToSteps } from '@/shared/lib/student-progress-storage'

import { STEPS_PER_SECTION } from '../lib/step-sections'

export function useCurrentProgramStep(completedIds: number[]) {
	const excludeKey = completedIds.join(',')

	return useQuery({
		queryKey: stepKeys.current(excludeKey),
		queryFn: () => fetchCurrentStep(completedIds),
		select: (data): StepListItem | null =>
			data.step ? { ...data.step, status: 'current' } : null,
	})
}

export function useProgramStepsPage(page: number, currentStepId?: number) {
	return useQuery({
		queryKey: stepKeys.page(page, STEPS_PER_SECTION),
		queryFn: () => fetchStepsPage(page, STEPS_PER_SECTION),
		select: (data) => ({
			...data,
			steps: applyProgressToSteps(data.steps, { currentStepId }),
		}),
	})
}

'use client'

import { useEffect, useState } from 'react'

import type { StepListItem } from '@/entities/step'
import {
	applyProgressToSteps,
	subscribeProgress,
	type StepMeta,
} from '@/shared/lib/student-progress-storage'

import { StudentHome } from './StudentHome'

interface StudentHomeWithProgressProps {
	stepsMeta: StepMeta[]
	totalPublished: number
}

export function StudentHomeWithProgress({
	stepsMeta,
	totalPublished,
}: StudentHomeWithProgressProps) {
	const [steps, setSteps] = useState<StepListItem[]>(() => applyProgressToSteps(stepsMeta))

	useEffect(() => {
		setSteps(applyProgressToSteps(stepsMeta))
		return subscribeProgress(() => {
			setSteps(applyProgressToSteps(stepsMeta))
		})
	}, [stepsMeta])

	return (
		<StudentHome userName="Ученик" steps={steps} totalPublished={totalPublished} />
	)
}

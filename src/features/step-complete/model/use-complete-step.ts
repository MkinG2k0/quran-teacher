'use client'

import { useCallback, useState } from 'react'

import { markStepComplete } from '@/shared/lib/student-progress-storage'

export function useCompleteStep() {
	const [isPending, setIsPending] = useState(false)

	const completeStep = useCallback(async (stepId: number) => {
		setIsPending(true)
		try {
			markStepComplete(stepId)
			return true
		} finally {
			setIsPending(false)
		}
	}, [])

	return { completeStep, isPending }
}

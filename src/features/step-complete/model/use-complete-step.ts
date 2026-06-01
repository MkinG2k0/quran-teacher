'use client'

import { useCallback, useState } from 'react'

export function useCompleteStep() {
	const [isPending, setIsPending] = useState(false)

	const completeStep = useCallback(async (stepId: number) => {
		setIsPending(true)
		try {
			const res = await fetch('/api/progress', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ stepId }),
			})
			if (!res.ok) throw new Error('Failed')
			return true
		} finally {
			setIsPending(false)
		}
	}, [])

	return { completeStep, isPending }
}

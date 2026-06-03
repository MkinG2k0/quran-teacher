'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PageProps {
	params: Promise<{ id: string }>
}

/** Старые ссылки /step/[id] → главная с ?step= */
export default function StepRedirectPage({ params }: PageProps) {
	const router = useRouter()
	const { id } = use(params)

	useEffect(() => {
		const stepId = Number(id)
		if (Number.isInteger(stepId) && stepId > 0) {
			router.replace(`/?step=${stepId}`)
			return
		}
		router.replace('/')
	}, [id, router])

	return null
}

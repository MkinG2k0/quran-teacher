'use client'

import { useParams, useRouter } from 'next/navigation'

import { StepLessonView } from '@/widgets/step-lesson'

export default function StepPage() {
	const router = useRouter()
	const { id } = useParams<{ id: string }>()
	const stepId = Number(id)

	return (
		<StepLessonView
			stepId={stepId}
			onClose={() => router.push('/')}
			onOpenStep={(nextId) => router.push(`/step/${nextId}`)}
		/>
	)
}

'use client'

import { useQuery } from '@tanstack/react-query'

import { fetchStepDetail } from '@/entities/step'
import { StepReader } from '@/widgets/step-reader'

interface StepLessonViewProps {
	stepId: number
	onClose: () => void
	onOpenStep: (stepId: number) => void
}

export function StepLessonView({
	stepId,
	onClose,
	onOpenStep,
}: StepLessonViewProps) {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['step', 'detail', stepId],
		queryFn: () => fetchStepDetail(stepId),
		enabled: Number.isInteger(stepId) && stepId > 0,
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	})

	if (!Number.isInteger(stepId) || stepId <= 0) {
		return <StepLoadState message="Шаг не найден" onClose={onClose} />
	}

	if (isLoading) {
		return <StepLoadState message="Загрузка урока…" onClose={onClose} />
	}

	if (isError || !data) {
		return (
			<StepLoadState message="Не удалось загрузить урок" onClose={onClose} />
		)
	}

	return (
		<StepReader
			step={data.step}
			nextStepId={data.nextStepId}
			onClose={onClose}
			onOpenStep={onOpenStep}
		/>
	)
}

function StepLoadState({
	message,
	onClose,
}: {
	message: string
	onClose: () => void
}) {
	return (
		<div
			className="font-body"
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 50,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 24,
				textAlign: 'center',
				color: '#8A8070',
				background: '#0D1117',
			}}
		>
			<p style={{ marginBottom: 16 }}>{message}</p>
			<button
				type="button"
				onClick={onClose}
				style={{
					padding: '10px 20px',
					borderRadius: 8,
					border: '1px solid #2A2418',
					background: '#141414',
					color: '#E8E0D0',
					cursor: 'pointer',
				}}
			>
				Назад
			</button>
		</div>
	)
}

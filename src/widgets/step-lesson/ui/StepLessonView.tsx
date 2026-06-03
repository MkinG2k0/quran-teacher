'use client'

import { useQuery } from '@tanstack/react-query'
import type { RefObject } from 'react'

import { fetchStepDetail } from '@/entities/step'
import { qColors, qShell } from '@/shared/lib/quran-tailwind'
import { cn } from '@/shared/lib/utils'
import { StepReader } from '@/widgets/step-reader'

interface StepLessonViewProps {
	stepId: number
	scrollContainerRef?: RefObject<HTMLElement | null>
	onClose: () => void
	onOpenStep: (stepId: number) => void
}

export function StepLessonView({
	stepId,
	scrollContainerRef,
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
			scrollContainerRef={scrollContainerRef}
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
			className={cn(
				'font-body mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center p-6 text-center',
				qShell,
				qColors.fgSecondary,
			)}
		>
			<p className="mb-4">{message}</p>
			<button
				type="button"
				onClick={onClose}
				className={cn(
					'cursor-pointer rounded-lg border border-[var(--quran-panel-border)] bg-[var(--quran-elevated)] px-5 py-2.5',
					qColors.fg,
				)}
			>
				Назад
			</button>
		</div>
	)
}

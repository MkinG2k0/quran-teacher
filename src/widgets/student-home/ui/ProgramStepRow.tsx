'use client'

import type { StepListItem } from '@/entities/step'
import { qColors, qText } from '@/shared/lib/quran-tailwind'
import { cn } from '@/shared/lib/utils'

interface ProgramStepRowProps {
	step: StepListItem
	onSelect: (step: StepListItem) => void
}

export function ProgramStepRow({ step, onSelect }: ProgramStepRowProps) {
	const isCurrent = step.status === 'current'
	const isCompleted = step.status === 'completed'

	const handleClick = () => onSelect(step)

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') onSelect(step)
	}

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={cn(
				'flex cursor-pointer items-center gap-3.5 rounded-[10px] px-3.5 py-3',
				isCurrent
					? 'border border-[var(--quran-row-current-border)] bg-[image:var(--quran-row-current-bg)] shadow-[0_0_16px_rgba(201,168,76,0.12)]'
					: 'border border-[var(--quran-row-border)] bg-[var(--quran-row-bg)]',
			)}
		>
			<div
				className={cn(
					'flex size-8 shrink-0 items-center justify-center rounded-full',
					qText(11),
					isCurrent && 'quran-badge-current',
					isCompleted &&
						'border border-[#4A7A30] bg-[linear-gradient(135deg,#2A3A20,#3A5228)] text-[#6ABB40]',
					isCurrent &&
						!isCompleted &&
						'border border-[var(--quran-accent)] bg-[linear-gradient(135deg,#2A2010,#3A2E10)] text-[var(--quran-accent)]',
					!isCompleted &&
						!isCurrent &&
						cn('border', qColors.borderStrong, qColors.elevated, qColors.fgSubtle),
				)}
			>
				{isCompleted ? '✓' : step.order}
			</div>

			<div className="min-w-0 flex-1">
				<p
					className={cn(
						'font-body truncate font-semibold',
						qText(13),
						isCompleted && qColors.fgSecondary,
						isCurrent && qColors.fg,
						!isCompleted && !isCurrent && qColors.fgSecondary,
					)}
				>
					{step.title}
				</p>
				{step.subtitle && (
					<p
						className={cn(
							'font-body mt-px',
							qText(11),
							isCompleted && qColors.fgSubtle,
							isCurrent && qColors.fgSubtle,
							!isCompleted && !isCurrent && qColors.fgMuted,
						)}
					>
						{step.subtitle}
					</p>
				)}
			</div>
		</div>
	)
}

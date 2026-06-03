'use client'

import type { StepListItem } from '@/entities/step'
import { useFontSettings } from '@/features/font-settings'

interface ProgramStepRowProps {
	step: StepListItem
	onSelect: (step: StepListItem) => void
}

export function ProgramStepRow({ step, onSelect }: ProgramStepRowProps) {
	const { px } = useFontSettings()
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
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 14,
				padding: '12px 14px',
				borderRadius: 10,
				background: isCurrent
					? 'linear-gradient(135deg, #131A10, #1A1E10)'
					: '#101010',
				border: isCurrent
					? '1px solid rgba(201,168,76,0.35)'
					: '1px solid #181818',
				cursor: 'pointer',
				boxShadow: isCurrent ? '0 0 16px rgba(201,168,76,0.12)' : undefined,
			}}
		>
			<div
				className={isCurrent ? 'quran-badge-current' : ''}
				style={{
					width: 32,
					height: 32,
					borderRadius: '50%',
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: isCompleted
						? 'linear-gradient(135deg, #2A3A20, #3A5228)'
						: isCurrent
							? 'linear-gradient(135deg, #2A2010, #3A2E10)'
							: '#181818',
					border: isCompleted
						? '1px solid #4A7A30'
						: isCurrent
							? '1px solid #C9A84C'
							: '1px solid #282828',
					fontSize: px(11),
					color: isCompleted
						? '#6ABB40'
						: isCurrent
							? '#C9A84C'
							: 'var(--quran-fg-subtle)',
				}}
			>
				{isCompleted ? '✓' : step.order}
			</div>

			<div style={{ flex: 1, minWidth: 0 }}>
				<p
					className="font-body"
					style={{
						fontSize: px(13),
						fontWeight: 600,
						color: isCompleted
							? '#7A7060'
							: isCurrent
								? '#E8E0D0'
								: 'var(--quran-fg-secondary)',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					{step.title}
				</p>
				{step.subtitle && (
					<p
						className="font-body"
						style={{
							fontSize: px(11),
							color: isCompleted
								? 'var(--quran-fg-subtle)'
								: isCurrent
									? '#8A7A60'
									: 'var(--quran-fg-muted)',
							marginTop: 1,
						}}
					>
						{step.subtitle}
					</p>
				)}
			</div>

			<span
				className="font-body"
				style={{
					fontSize: px(10),
					color: 'var(--quran-fg-muted)',
					flexShrink: 0,
				}}
			>
				{step.order}
			</span>
		</div>
	)
}

'use client'

import { useFontSettings } from '@/features/font-settings'

import { formatSectionRange, STEPS_PER_SECTION } from '../lib/step-sections'

interface ProgramStepPaginationProps {
	page: number
	totalPages: number
	stepsOnPage: number
	onPageChange: (page: number) => void
}

export function ProgramStepPagination({
	page,
	totalPages,
	stepsOnPage,
	onPageChange,
}: ProgramStepPaginationProps) {
	const { px } = useFontSettings()
	const rangeLabel = formatSectionRange(page - 1, STEPS_PER_SECTION, stepsOnPage)
	const canGoPrev = page > 1
	const canGoNext = page < totalPages

	const handlePrev = () => {
		if (canGoPrev) onPageChange(page - 1)
	}

	const handleNext = () => {
		if (canGoNext) onPageChange(page + 1)
	}

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 12,
				marginBottom: 12,
				padding: '10px 12px',
				borderRadius: 12,
				border: '1px solid var(--quran-border)',
				background: 'var(--quran-pagination-bg)',
			}}
		>
			<button
				type="button"
				onClick={handlePrev}
				disabled={!canGoPrev}
				aria-label="Предыдущий блок"
				style={{
					border: '1px solid var(--quran-panel-border)',
					background: canGoPrev
						? 'var(--quran-pagination-active-bg)'
						: 'transparent',
					color: canGoPrev ? 'var(--quran-accent)' : 'var(--quran-fg-disabled)',
					borderRadius: 8,
					width: 36,
					height: 36,
					cursor: canGoPrev ? 'pointer' : 'default',
					fontSize: px(16),
				}}
			>
				←
			</button>

			<div style={{ textAlign: 'center', minWidth: 0 }}>
				<p
					className="font-body"
					style={{
						fontSize: px(12),
						fontWeight: 600,
						color: 'var(--quran-fg)',
					}}
				>
					{rangeLabel}
				</p>
				<p
					className="font-body"
					style={{
						fontSize: px(10),
						color: 'var(--quran-fg-muted)',
						marginTop: 2,
					}}
				>
					Блок {page} из {totalPages}
				</p>
			</div>

			<button
				type="button"
				onClick={handleNext}
				disabled={!canGoNext}
				aria-label="Следующий блок"
				style={{
					border: '1px solid var(--quran-panel-border)',
					background: canGoNext
						? 'var(--quran-pagination-active-bg)'
						: 'transparent',
					color: canGoNext ? 'var(--quran-accent)' : 'var(--quran-fg-disabled)',
					borderRadius: 8,
					width: 36,
					height: 36,
					cursor: canGoNext ? 'pointer' : 'default',
					fontSize: px(16),
				}}
			>
				→
			</button>
		</div>
	)
}

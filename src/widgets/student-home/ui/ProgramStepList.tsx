'use client'

import type { StepListItem } from '@/entities/step'
import { useFontSettings } from '@/features/font-settings'

import { ProgramStepPagination } from './ProgramStepPagination'
import { ProgramStepRow } from './ProgramStepRow'

interface ProgramStepListProps {
	steps: StepListItem[]
	page: number
	totalPages: number
	isLoading: boolean
	onPageChange: (page: number) => void
	onSelectStep: (step: StepListItem) => void
}

export function ProgramStepList({
	steps,
	page,
	totalPages,
	isLoading,
	onPageChange,
	onSelectStep,
}: ProgramStepListProps) {
	const { px } = useFontSettings()

	if (!isLoading && steps.length === 0 && totalPages <= 1) {
		return (
			<p
				className="font-body"
				style={{
					textAlign: 'center',
					padding: 16,
					color: 'var(--quran-fg-muted)',
					fontSize: px(12),
				}}
			>
				Шаги программы пока не опубликованы
			</p>
		)
	}

	const completedOnPage = steps.filter((step) => step.status === 'completed').length

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
			{totalPages > 1 && (
				<ProgramStepPagination
					page={page}
					totalPages={totalPages}
					stepsOnPage={steps.length}
					onPageChange={onPageChange}
				/>
			)}

			{isLoading ? (
				<p
					className="font-body"
					style={{
						textAlign: 'center',
						padding: 24,
						color: 'var(--quran-fg-muted)',
						fontSize: px(12),
					}}
				>
					Загрузка шагов...
				</p>
			) : (
				<>
					{steps.length > 0 && (
						<p
							className="font-body"
							style={{
								fontSize: px(10),
								color: 'var(--quran-fg-muted)',
								marginBottom: 4,
							}}
						>
							{completedOnPage} из {steps.length} пройдено в этом блоке
						</p>
					)}
					<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
						{steps.map((step) => (
							<ProgramStepRow key={step.id} step={step} onSelect={onSelectStep} />
						))}
					</div>
				</>
			)}
		</div>
	)
}

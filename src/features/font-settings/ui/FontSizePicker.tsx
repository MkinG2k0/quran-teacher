'use client'

import { qColors, qGradientAccent, qText } from '@/shared/lib/quran-tailwind'
import { cn } from '@/shared/lib/utils'

import { FONT_SCALE_OPTIONS, type FontScale } from '../lib/constants'
import { useFontSettings } from '../model/font-settings-context'

interface FontSizePickerProps {
	variant?: 'default' | 'compact'
}

export function FontSizePicker({ variant = 'default' }: FontSizePickerProps) {
	const { scale, setScale } = useFontSettings()

	if (variant === 'compact') {
		return (
			<div
				role="group"
				aria-label="Размер шрифта"
				className={cn(
					'flex shrink-0 gap-0.5 rounded-lg border p-0.5',
					qColors.borderStrong,
					qColors.elevated,
				)}
			>
				{FONT_SCALE_OPTIONS.map((opt) => (
					<button
						key={opt.id}
						type="button"
						aria-pressed={scale === opt.id}
						aria-label={opt.label}
						onClick={() => setScale(opt.id)}
						className={cn(
							'font-body min-w-7 h-7 cursor-pointer rounded-md border-none',
							scale === opt.id ? qText(13) : qText(11),
							scale === opt.id ? 'font-bold' : 'font-normal',
							scale === opt.id
								? cn(qGradientAccent, qColors.onAccent)
								: cn('bg-transparent', qColors.fgSecondary),
						)}
					>
						{compactLabel(opt.id)}
					</button>
				))}
			</div>
		)
	}

	return (
		<div role="group" aria-label="Размер шрифта" className="flex gap-2">
			{FONT_SCALE_OPTIONS.map((opt) => (
				<button
					key={opt.id}
					type="button"
					aria-pressed={scale === opt.id}
					onClick={() => setScale(opt.id)}
					className={cn(
						'font-body flex-1 cursor-pointer rounded-[10px] px-2 py-3',
						qText(13),
						scale === opt.id ? 'font-semibold' : 'font-normal',
						scale === opt.id
							? 'border border-[var(--quran-accent)] bg-[image:var(--quran-picker-active-bg)] text-[var(--quran-accent)]'
							: cn(
									'border border-[var(--quran-panel-border)]',
									qColors.elevated,
									qColors.fgSecondary,
								),
					)}
				>
					{opt.label}
				</button>
			))}
		</div>
	)
}

function compactLabel(id: FontScale): string {
	if (id === 'sm') return 'A−'
	if (id === 'lg') return 'A+'
	return 'A'
}

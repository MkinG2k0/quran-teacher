'use client'

import { FONT_SCALE_OPTIONS, type FontScale } from '../lib/constants'
import { useFontSettings } from '../model/font-settings-context'

interface FontSizePickerProps {
	variant?: 'default' | 'compact'
}

export function FontSizePicker({ variant = 'default' }: FontSizePickerProps) {
	const { scale, setScale, px } = useFontSettings()

	if (variant === 'compact') {
		return (
			<div
				role="group"
				aria-label="Размер шрифта"
				style={{
					display: 'flex',
					gap: 2,
					flexShrink: 0,
					background: 'var(--quran-elevated)',
					border: '1px solid var(--quran-border-strong)',
					borderRadius: 8,
					padding: 2,
				}}
			>
				{FONT_SCALE_OPTIONS.map((opt) => (
					<button
						key={opt.id}
						type="button"
						aria-pressed={scale === opt.id}
						aria-label={opt.label}
						onClick={() => setScale(opt.id)}
						className="font-body"
						style={{
							minWidth: 28,
							height: 28,
							border: 'none',
							borderRadius: 6,
							cursor: 'pointer',
							fontSize: scale === opt.id ? px(13) : px(11),
							fontWeight: scale === opt.id ? 700 : 400,
							color:
								scale === opt.id
									? 'var(--quran-on-accent)'
									: 'var(--quran-fg-secondary)',
							background:
								scale === opt.id
									? 'var(--quran-gradient-accent)'
									: 'transparent',
						}}
					>
						{compactLabel(opt.id)}
					</button>
				))}
			</div>
		)
	}

	return (
		<div role="group" aria-label="Размер шрифта" style={{ display: 'flex', gap: 8 }}>
			{FONT_SCALE_OPTIONS.map((opt) => (
				<button
					key={opt.id}
					type="button"
					aria-pressed={scale === opt.id}
					onClick={() => setScale(opt.id)}
					className="font-body"
					style={{
						flex: 1,
						padding: '12px 8px',
						borderRadius: 10,
						border:
							scale === opt.id
								? '1px solid var(--quran-accent)'
								: '1px solid var(--quran-panel-border)',
						background:
							scale === opt.id
								? 'var(--quran-picker-active-bg)'
								: 'var(--quran-elevated)',
						color:
							scale === opt.id
								? 'var(--quran-accent)'
								: 'var(--quran-fg-secondary)',
						cursor: 'pointer',
						fontSize: px(13),
						fontWeight: scale === opt.id ? 600 : 400,
					}}
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

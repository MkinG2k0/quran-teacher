'use client'

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
				style={{
					display: 'flex',
					gap: 2,
					flexShrink: 0,
					background: '#141414',
					border: '1px solid #222',
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
							fontSize: scale === opt.id ? 13 : 11,
							fontWeight: scale === opt.id ? 700 : 400,
							color: scale === opt.id ? '#0D1117' : '#6B6555',
							background:
								scale === opt.id
									? 'linear-gradient(135deg, #8B6914, #C9A84C)'
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
						border: scale === opt.id ? '1px solid #C9A84C' : '1px solid #2A2418',
						background:
							scale === opt.id
								? 'linear-gradient(135deg, #1A1208, #201808)'
								: '#141414',
						color: scale === opt.id ? '#C9A84C' : '#6B6555',
						cursor: 'pointer',
						fontSize: 13,
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

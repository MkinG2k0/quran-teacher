'use client'

import { QURAN_THEME_OPTIONS } from '../lib/constants'
import { useThemeSettings } from '../model/theme-settings-context'

export function ThemePicker() {
	const { theme, setTheme } = useThemeSettings()

	return (
		<div
			role="group"
			aria-label="Тема оформления"
			style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
		>
			{QURAN_THEME_OPTIONS.map((opt) => {
				const selected = theme === opt.id
				return (
					<button
						key={opt.id}
						type="button"
						aria-pressed={selected}
						onClick={() => setTheme(opt.id)}
						className="font-body"
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							width: '100%',
							padding: '12px 14px',
							borderRadius: 10,
							border: selected
								? '1px solid var(--quran-accent)'
								: '1px solid var(--quran-panel-border)',
							background: selected
								? 'var(--quran-picker-active-bg)'
								: 'var(--quran-elevated)',
							color: selected ? 'var(--quran-accent)' : 'var(--quran-fg-secondary)',
							cursor: 'pointer',
							fontSize: 13,
							fontWeight: selected ? 600 : 400,
							textAlign: 'left',
						}}
					>
						<span
							aria-hidden
							data-theme-preview={opt.id}
							className="quran-theme-swatch"
						/>
						{opt.label}
					</button>
				)
			})}
		</div>
	)
}

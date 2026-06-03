import type { CSSProperties } from 'react'

export function headerIconButtonStyle(
	px: (base: number) => number,
	active?: boolean,
): CSSProperties {
	return {
		width: 34,
		height: 34,
		borderRadius: '50%',
		flexShrink: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		border: active
			? '1px solid var(--quran-accent)'
			: '1px solid var(--quran-border-strong)',
		background: active ? 'var(--quran-highlight-bg)' : 'var(--quran-elevated)',
		color: active ? 'var(--quran-accent)' : 'var(--quran-fg-secondary)',
	}
}

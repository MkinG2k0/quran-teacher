import { cn } from './utils'

/** Статические классы — Tailwind не видит динамические arbitrary values */
const Q_TEXT_CLASS = {
	9: 'text-q-9',
	10: 'text-q-10',
	11: 'text-q-11',
	12: 'text-q-12',
	13: 'text-q-13',
	14: 'text-q-14',
	15: 'text-q-15',
	16: 'text-q-16',
	17: 'text-q-17',
	18: 'text-q-18',
	20: 'text-q-20',
	22: 'text-q-22',
	24: 'text-q-24',
	26: 'text-q-26',
	30: 'text-q-30',
	32: 'text-q-32',
	36: 'text-q-36',
	42: 'text-q-42',
	48: 'text-q-48',
	64: 'text-q-64',
} as const

export type QuranTextSize = keyof typeof Q_TEXT_CLASS

export function qText(base: QuranTextSize) {
	return Q_TEXT_CLASS[base]
}

export const qColors = {
	bg: 'bg-[var(--quran-bg)]',
	fg: 'text-[var(--quran-fg)]',
	fgSecondary: 'text-[var(--quran-fg-secondary)]',
	fgSubtle: 'text-[var(--quran-fg-subtle)]',
	fgMuted: 'text-[var(--quran-fg-muted)]',
	fgDisabled: 'text-[var(--quran-fg-disabled)]',
	accent: 'text-[var(--quran-accent)]',
	onAccent: 'text-[var(--quran-on-accent)]',
	body: 'text-[var(--quran-body-text)]',
	border: 'border-[var(--quran-border)]',
	borderStrong: 'border-[var(--quran-border-strong)]',
	panelBorder: 'border-[var(--quran-panel-border)]',
	elevated: 'bg-[var(--quran-elevated)]',
	surface: 'bg-[var(--quran-surface)]',
} as const

export const qShell =
	'min-h-screen relative overflow-hidden bg-[var(--quran-bg)] text-[var(--quran-fg)]'

export const qCard =
	'rounded-2xl border border-[var(--quran-card-border)] bg-[image:var(--quran-card-bg)] p-5'

export const qElevatedBtn =
	'inline-flex items-center gap-1.5 rounded-lg border border-[var(--quran-panel-border)] bg-[var(--quran-elevated)] px-2.5 py-1.5 no-underline text-[var(--quran-fg-secondary)]'

export const qProgressTrack =
	'h-1.5 overflow-hidden rounded bg-[var(--quran-progress-track)]'

export const qProgressFill = 'quran-progress-fill h-full transition-[width] duration-1000 ease-out'

export const qGradientAccent = 'bg-[image:var(--quran-gradient-accent)]'

export const qModalOverlay =
	'fixed inset-0 z-[60] flex items-end justify-center bg-[var(--quran-modal-overlay)] p-4 backdrop-blur-md'

export const qModalPanel =
	'flex max-h-[min(70vh,520px)] w-full max-w-[480px] flex-col overflow-hidden rounded-2xl border border-[var(--quran-panel-border)] bg-[image:var(--quran-modal-bg)]'

export function headerIconButtonClass(active?: boolean) {
	return cn(
		'flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full',
		active
			? 'border border-[var(--quran-accent)] bg-[image:var(--quran-highlight-bg)] text-[var(--quran-accent)]'
			: cn(qColors.borderStrong, qColors.elevated, qColors.fgSecondary, 'border'),
	)
}

export function themeSwatchClass(themeId: 'dark' | 'light' | 'sepia') {
	const gradients: Record<typeof themeId, string> = {
		dark: 'bg-[linear-gradient(135deg,#0d1117_50%,#c9a84c_50%)]',
		light: 'bg-[linear-gradient(135deg,#f7f3eb_50%,#9a7a28_50%)]',
		sepia: 'bg-[linear-gradient(135deg,#1e1a14_50%,#d4b060_50%)]',
	}
	return cn(
		'size-7 shrink-0 rounded-full border border-[var(--quran-panel-border)]',
		gradients[themeId],
	)
}

export function pickerOptionClass(selected: boolean) {
	return cn(
		'font-body w-full cursor-pointer rounded-[10px] px-3.5 py-3 text-left transition-colors',
		qText(13),
		selected
			? 'border border-[var(--quran-accent)] bg-[image:var(--quran-picker-active-bg)] font-semibold text-[var(--quran-accent)]'
			: cn('border border-[var(--quran-panel-border)]', qColors.elevated, qColors.fgSecondary),
	)
}

export type FontScale = 'sm' | 'md' | 'lg'

export const FONT_BASE_OFFSET = 2

export const FONT_SCALE_MULTIPLIER: Record<FontScale, number> = {
	sm: 0.88,
	md: 1,
	lg: 1.2,
}

export function fontPx(base: number, scale: FontScale = 'md'): number {
	return Math.round(base * FONT_SCALE_MULTIPLIER[scale]) + FONT_BASE_OFFSET
}

export const FONT_SCALE_OPTIONS: { id: FontScale; label: string }[] = [
	{ id: 'sm', label: 'Мелкий' },
	{ id: 'md', label: 'Обычный' },
	{ id: 'lg', label: 'Крупный' },
]

export type FontScale = 'sm' | 'md' | 'lg'

export const FONT_SCALE_MULTIPLIER: Record<FontScale, number> = {
	sm: 0.88,
	md: 1,
	lg: 1.2,
}

export const FONT_SCALE_OPTIONS: { id: FontScale; label: string }[] = [
	{ id: 'sm', label: 'Мелкий' },
	{ id: 'md', label: 'Обычный' },
	{ id: 'lg', label: 'Крупный' },
]

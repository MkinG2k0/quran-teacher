import type { FontScale } from './constants'

const STORAGE_KEY = 'quran-font-scale'

const VALID: FontScale[] = ['sm', 'md', 'lg']

export function getSavedFontScale(): FontScale {
	if (typeof window === 'undefined') return 'md'

	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (raw && VALID.includes(raw as FontScale)) return raw as FontScale
	} catch {
		/* ignore */
	}
	return 'md'
}

export function setSavedFontScale(scale: FontScale) {
	localStorage.setItem(STORAGE_KEY, scale)
	window.dispatchEvent(new Event('quran-font-scale-change'))
}

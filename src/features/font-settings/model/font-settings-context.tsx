'use client'

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react'

import {
	FONT_SCALE_MULTIPLIER,
	type FontScale,
} from '../lib/constants'
import {
	getSavedFontScale,
	setSavedFontScale,
} from '../lib/font-settings-storage'

interface FontSettingsContextValue {
	scale: FontScale
	setScale: (scale: FontScale) => void
	px: (base: number) => number
}

const FontSettingsContext = createContext<FontSettingsContextValue | null>(null)

function applyScaleCss(scale: FontScale) {
	document.documentElement.style.setProperty(
		'--quran-font-scale',
		String(FONT_SCALE_MULTIPLIER[scale]),
	)
}

export function FontSettingsProvider({ children }: { children: ReactNode }) {
	const [scale, setScaleState] = useState<FontScale>('md')

	useEffect(() => {
		const saved = getSavedFontScale()
		setScaleState(saved)
		applyScaleCss(saved)

		const onChange = () => setScaleState(getSavedFontScale())
		window.addEventListener('quran-font-scale-change', onChange)
		return () => window.removeEventListener('quran-font-scale-change', onChange)
	}, [])

	const setScale = useCallback((next: FontScale) => {
		setScaleState(next)
		setSavedFontScale(next)
		applyScaleCss(next)
	}, [])

	const value = useMemo<FontSettingsContextValue>(
		() => ({
			scale,
			setScale,
			px: (base) => Math.round(base * FONT_SCALE_MULTIPLIER[scale]),
		}),
		[scale, setScale],
	)

	return (
		<FontSettingsContext.Provider value={value}>
			{children}
		</FontSettingsContext.Provider>
	)
}

export function useFontSettings() {
	const ctx = useContext(FontSettingsContext)
	if (!ctx) {
		throw new Error('useFontSettings must be used within FontSettingsProvider')
	}
	return ctx
}

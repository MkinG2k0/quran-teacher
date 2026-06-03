import type { OfflineProgramBundle } from './types'

const LS_KEY = 'quran-offline-bundle'

export function getOfflineBundleSync(): OfflineProgramBundle | null {
	if (typeof window === 'undefined') return null
	try {
		const raw = localStorage.getItem(LS_KEY)
		if (!raw) return null
		const parsed = JSON.parse(raw) as OfflineProgramBundle
		if (!parsed?.steps?.length) return null
		return parsed
	} catch {
		return null
	}
}

export function saveOfflineBundle(bundle: OfflineProgramBundle): void {
	if (typeof window === 'undefined') return
	try {
		localStorage.setItem(LS_KEY, JSON.stringify(bundle))
		window.dispatchEvent(new Event('quran-offline-bundle-ready'))
	} catch {
		// quota exceeded
	}
}

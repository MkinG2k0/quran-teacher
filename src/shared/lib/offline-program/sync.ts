import type { OfflineProgramBundle } from './types'
import { getOfflineBundleSync, saveOfflineBundle } from './storage'

const BUNDLE_URLS = ['/offline/program.json', '/api/offline/program'] as const

let hydratePromise: Promise<OfflineProgramBundle | null> | null = null

async function fetchBundle(url: string): Promise<OfflineProgramBundle | null> {
	try {
		const res = await fetch(url)
		if (!res.ok) return null
		return (await res.json()) as OfflineProgramBundle
	} catch {
		return null
	}
}

export function ensureOfflineProgramHydrated(): Promise<OfflineProgramBundle | null> {
	const cached = getOfflineBundleSync()
	if (cached) return Promise.resolve(cached)

	if (hydratePromise) return hydratePromise

	hydratePromise = (async () => {
		for (const url of BUNDLE_URLS) {
			const bundle = await fetchBundle(url)
			if (bundle?.steps.length) {
				saveOfflineBundle(bundle)
				return bundle
			}
		}

		return getOfflineBundleSync()
	})().finally(() => {
		hydratePromise = null
	})

	return hydratePromise
}

export async function refreshOfflineProgramInBackground(): Promise<void> {
	if (typeof navigator !== 'undefined' && !navigator.onLine) return

	const cached = getOfflineBundleSync()
	const bundle = await fetchBundle('/api/offline/program')
	if (!bundle?.steps.length) return

	if (
		cached &&
		cached.version === bundle.version &&
		cached.totalPublished === bundle.totalPublished
	) {
		return
	}

	saveOfflineBundle(bundle)
}

export async function prefetchOfflineAssets(urls: string[]): Promise<void> {
	const sameOrigin = urls.filter((url) => url.startsWith('/'))
	await Promise.allSettled(
		sameOrigin.map((url) => fetch(url, { credentials: 'same-origin' })),
	)
}

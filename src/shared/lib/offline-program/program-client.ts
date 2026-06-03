import type { OfflineProgramBundle } from './types'
import { getOfflineBundleSync } from './storage'
import { ensureOfflineProgramHydrated } from './sync'

export async function fetchFromProgramBundle<T>(
	resolver: (bundle: OfflineProgramBundle) => T | null,
): Promise<T> {
	const sync = getOfflineBundleSync()
	if (sync) {
		const hit = resolver(sync)
		if (hit) return hit
	}

	const bundle = await ensureOfflineProgramHydrated()
	if (!bundle) throw new Error('Офлайн-программа не загружена')

	const result = resolver(bundle)
	if (!result) throw new Error('Данные не найдены')

	return result
}

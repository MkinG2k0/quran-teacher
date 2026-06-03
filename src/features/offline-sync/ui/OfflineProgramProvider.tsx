'use client'

import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { warmProgramCache } from '@/entities/step'
import {
	ensureOfflineProgramHydrated,
	getOfflineBundleSync,
	prefetchOfflineAssets,
	refreshOfflineProgramInBackground,
	type OfflineProgramBundle,
} from '@/shared/lib/offline-program'

interface OfflineProgramProviderProps {
	children: React.ReactNode
}

export function OfflineProgramProvider({ children }: OfflineProgramProviderProps) {
	const queryClient = useQueryClient()
	const [ready, setReady] = useState(() => !!getOfflineBundleSync()?.steps.length)

	const applyBundle = useCallback(
		(bundle: OfflineProgramBundle) => {
			warmProgramCache(queryClient, bundle)
			setReady(true)
			if (bundle.assetUrls.length > 0 && navigator.onLine) {
				void prefetchOfflineAssets(bundle.assetUrls)
			}
		},
		[queryClient],
	)

	useEffect(() => {
		let cancelled = false

		const cached = getOfflineBundleSync()
		if (cached?.steps.length) {
			applyBundle(cached)
		} else {
			void ensureOfflineProgramHydrated().then((bundle) => {
				if (!cancelled && bundle?.steps.length) applyBundle(bundle)
			})
		}

		const onBundleReady = () => {
			const bundle = getOfflineBundleSync()
			if (bundle?.steps.length) applyBundle(bundle)
		}

		const onOnline = () => {
			void refreshOfflineProgramInBackground().then(() => {
				const bundle = getOfflineBundleSync()
				if (bundle?.steps.length) warmProgramCache(queryClient, bundle)
			})
		}

		window.addEventListener('quran-offline-bundle-ready', onBundleReady)
		window.addEventListener('online', onOnline)

		return () => {
			cancelled = true
			window.removeEventListener('quran-offline-bundle-ready', onBundleReady)
			window.removeEventListener('online', onOnline)
		}
	}, [applyBundle, queryClient])

	if (!ready) {
		return (
			<div
				className="font-body"
				style={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: 24,
					color: '#8A8070',
					background: '#0D1117',
				}}
			>
				Подготовка офлайн-данных…
			</div>
		)
	}

	return children
}

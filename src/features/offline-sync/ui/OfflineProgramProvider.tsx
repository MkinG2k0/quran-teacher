'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { warmProgramCache } from '@/entities/step'
import { loadProgramBundle, prefetchOfflineAssets } from '@/shared/lib/offline-program'

interface OfflineProgramProviderProps {
	children: React.ReactNode
}

export function OfflineProgramProvider({ children }: OfflineProgramProviderProps) {
	const queryClient = useQueryClient()
	const [ready, setReady] = useState(false)

	useEffect(() => {
		let cancelled = false

		void loadProgramBundle().then((bundle) => {
			if (cancelled || !bundle?.steps.length) return

			warmProgramCache(queryClient, bundle)
			setReady(true)

			if (bundle.assetUrls.length > 0 && navigator.onLine) {
				void prefetchOfflineAssets(bundle.assetUrls)
			}
		})

		return () => {
			cancelled = true
		}
	}, [queryClient])

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
					color: 'var(--quran-fg-secondary)',
					background: 'var(--quran-bg)',
				}}
			>
				Загрузка программы…
			</div>
		)
	}

	return children
}

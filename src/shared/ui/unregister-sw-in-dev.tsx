'use client'

import { useEffect } from 'react'

/** В dev снимаем production SW, иначе он перехватывает localhost. */
export function UnregisterSwInDev() {
	useEffect(() => {
		if (process.env.NODE_ENV !== 'development') return
		if (!('serviceWorker' in navigator)) return

		void navigator.serviceWorker.getRegistrations().then((regs) => {
			void Promise.all(regs.map((r) => r.unregister()))
		})
	}, [])

	return null
}

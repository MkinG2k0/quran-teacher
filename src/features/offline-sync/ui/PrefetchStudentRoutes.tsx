'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/** Маршруты, которые должны открываться без сети (настройки и т.п.). */
const OFFLINE_STUDENT_ROUTES = ['/profile'] as const

export function PrefetchStudentRoutes() {
	const router = useRouter()

	useEffect(() => {
		if (!navigator.onLine) return

		for (const href of OFFLINE_STUDENT_ROUTES) {
			void router.prefetch(href)
		}
	}, [router])

	return null
}

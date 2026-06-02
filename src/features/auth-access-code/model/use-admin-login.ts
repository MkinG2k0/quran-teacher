'use client'

import { useCallback, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type LoginStatus = 'idle' | 'checking' | 'error' | 'success'

export function useAdminLogin() {
	const router = useRouter()
	const [password, setPassword] = useState('')
	const [status, setStatus] = useState<LoginStatus>('idle')
	const [shake, setShake] = useState(false)

	const handleSubmit = useCallback(
		async (e?: React.FormEvent) => {
			e?.preventDefault()
			if (!password.trim() || status === 'checking' || status === 'success') return

			setStatus('checking')
			const result = await signIn('credentials', {
				password,
				redirect: false,
			})

			if (!result || result.error) {
				setStatus('error')
				setShake(true)
				setTimeout(() => {
					setShake(false)
					setStatus('idle')
				}, 600)
				return
			}

			setStatus('success')
			router.refresh()
			router.push('/admin')
		},
		[password, router, status],
	)

	const handlePasswordChange = useCallback((value: string) => {
		setPassword(value)
		setStatus((s) => (s === 'error' ? 'idle' : s))
	}, [])

	return {
		password,
		status,
		shake,
		handleSubmit,
		handlePasswordChange,
	}
}

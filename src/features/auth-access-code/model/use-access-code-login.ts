'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type LoginStatus = 'idle' | 'checking' | 'error' | 'success'

export function useAccessCodeLogin() {
	const router = useRouter()
	const [digits, setDigits] = useState(['', '', '', '', '', ''])
	const [status, setStatus] = useState<LoginStatus>('idle')
	const [shake, setShake] = useState(false)
	const inputsRef = useRef<(HTMLInputElement | null)[]>([])

	const code = digits.join('')
	const filled = digits.every((d) => d !== '')

	const handleSubmit = useCallback(async () => {
		if (!filled || status === 'checking' || status === 'success') return

		setStatus('checking')
		const result = await signIn('credentials', {
			code,
			redirect: false,
		})

		// При redirect: false `ok` — статус HTTP (часто 200), ошибка — в `error`
		if (!result || result.error) {
			setStatus('error')
			setShake(true)
			setTimeout(() => {
				setShake(false)
				setDigits(['', '', '', '', '', ''])
				setStatus('idle')
				inputsRef.current[0]?.focus()
			}, 600)
			return
		}

		setStatus('success')
		router.refresh()
		router.push('/')
		return
	}, [code, filled, router, status])

	useEffect(() => {
		if (filled && status === 'idle') {
			void handleSubmit()
		}
	}, [digits, filled, handleSubmit, status])

	const handleDigit = (i: number, val: string) => {
		const v = val.replace(/\D/g, '').slice(-1)
		const next = [...digits]
		next[i] = v
		setDigits(next)
		if (status === 'error') setStatus('idle')
		if (v && i < 5) inputsRef.current[i + 1]?.focus()
	}

	const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace') {
			if (digits[i]) {
				const next = [...digits]
				next[i] = ''
				setDigits(next)
			} else if (i > 0) {
				inputsRef.current[i - 1]?.focus()
				const next = [...digits]
				next[i - 1] = ''
				setDigits(next)
			}
		}
	}

	const handlePaste = (e: React.ClipboardEvent) => {
		const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
		if (paste.length === 6) {
			setDigits(paste.split(''))
			inputsRef.current[5]?.focus()
		}
	}

	const borderColor = (i: number) => {
		if (status === 'error') return '#8B2020'
		if (status === 'success') return '#4A7A30'
		if (digits[i]) return '#3A2E10'
		return '#1E1E1E'
	}

	const bgColor = (i: number) => {
		if (status === 'error') return '#1A0A0A'
		if (status === 'success') return '#0A1A0A'
		if (digits[i]) return '#141414'
		return '#0F0F0F'
	}

	return {
		digits,
		status,
		shake,
		inputsRef,
		filled,
		handleDigit,
		handleKeyDown,
		handlePaste,
		borderColor,
		bgColor,
	}
}

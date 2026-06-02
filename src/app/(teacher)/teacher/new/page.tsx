'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export default function NewStudentPage() {
	const router = useRouter()

	useEffect(() => {
		router.replace('/')
	}, [router])

	const [name, setName] = useState('')
	const [age, setAge] = useState('')
	const [accessCode, setAccessCode] = useState<string | null>(null)
	const [error, setError] = useState('')
	const [isPending, setIsPending] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setIsPending(true)
		try {
			const res = await fetch('/api/students', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					age: age ? Number(age) : undefined,
				}),
			})
			const data = await res.json()
			if (!res.ok) {
				setError(data.error ?? 'Ошибка')
				return
			}
			setAccessCode(data.accessCode)
		} finally {
			setIsPending(false)
		}
	}

	return (
		<div
			className="font-body mx-auto min-h-screen max-w-md p-6"
			style={{ background: '#0D1117', color: '#E8E0D0' }}
		>
			<Link href="/teacher" className="mb-6 inline-block text-sm text-[#6B6555]">
				← К списку
			</Link>

			<h1 className="font-display mb-6 text-2xl font-semibold">Новый ученик</h1>

			{accessCode ? (
				<div
					className="rounded-xl border border-[#2A2418] p-6 text-center"
					style={{ background: '#101010' }}
				>
					<p className="mb-2 text-sm text-[#6B6555]">Код доступа</p>
					<p className="font-display text-4xl tracking-[0.3em] text-[#C9A84C]">
						{accessCode}
					</p>
					<p className="mt-4 text-xs text-[var(--quran-fg-secondary)]">
						Передайте код ученику для входа в приложение
					</p>
					<Button
						type="button"
						className="mt-6 w-full"
						onClick={() => router.push('/teacher')}
					>
						Готово
					</Button>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="name">Имя</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="mt-1 border-[#222] bg-[#111] text-[#E8E0D0]"
						/>
					</div>
					<div>
						<Label htmlFor="age">Возраст</Label>
						<Input
							id="age"
							type="number"
							min={5}
							max={99}
							value={age}
							onChange={(e) => setAge(e.target.value)}
							className="mt-1 border-[#222] bg-[#111] text-[#E8E0D0]"
						/>
					</div>
					{error && <p className="text-sm text-red-500">{error}</p>}
					<Button type="submit" disabled={isPending} className="w-full">
						{isPending ? 'Создаём...' : 'Создать'}
					</Button>
				</form>
			)}
		</div>
	)
}

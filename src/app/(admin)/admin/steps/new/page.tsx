'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export default function NewStepPage() {
	const router = useRouter()
	const [title, setTitle] = useState('')
	const [subtitle, setSubtitle] = useState('')
	const [isPending, setIsPending] = useState(false)

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsPending(true)
		try {
			const res = await fetch('/api/steps', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, subtitle: subtitle || null }),
			})
			const step = await res.json()
			if (res.ok) router.push(`/admin/steps/${step.id}`)
		} finally {
			setIsPending(false)
		}
	}

	return (
		<div className="font-body mx-auto max-w-md p-6">
			<h1 className="font-display mb-6 text-2xl font-semibold">Новый шаг</h1>
			<form onSubmit={handleCreate} className="space-y-4">
				<div>
					<Label htmlFor="title">Название</Label>
					<Input
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						className="mt-1 border-[#222] bg-[#111]"
					/>
				</div>
				<div>
					<Label htmlFor="subtitle">Подзаголовок</Label>
					<Input
						id="subtitle"
						value={subtitle}
						onChange={(e) => setSubtitle(e.target.value)}
						className="mt-1 border-[#222] bg-[#111]"
					/>
				</div>
				<Button type="submit" disabled={isPending} className="w-full">
					{isPending ? 'Создаём...' : 'Создать'}
				</Button>
			</form>
		</div>
	)
}

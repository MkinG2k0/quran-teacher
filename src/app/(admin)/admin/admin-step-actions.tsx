'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/button'

import { adminButtonDanger, adminButtonSecondary } from './admin-ui'

export function AdminStepActions({ stepId }: { stepId: number }) {
	const router = useRouter()

	const handleDelete = async () => {
		if (!confirm('Удалить шаг?')) return
		await fetch(`/api/steps/${stepId}`, { method: 'DELETE' })
		router.refresh()
	}

	return (
		<div className="flex justify-end gap-2">
			<Button
				render={<Link href={`/admin/steps/${stepId}`} />}
				variant="outline"
				size="sm"
				type="button"
				className={cn(adminButtonSecondary)}
			>
				Изменить
			</Button>
			<Button
				variant="outline"
				size="sm"
				type="button"
				onClick={handleDelete}
				className={cn(adminButtonDanger)}
			>
				Удалить
			</Button>
		</div>
	)
}

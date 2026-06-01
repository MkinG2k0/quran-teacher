'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/shared/ui/button'

export function AdminStepActions({ stepId }: { stepId: number }) {
	const router = useRouter()

	const handleDelete = async () => {
		if (!confirm('Удалить шаг?')) return
		await fetch(`/api/steps/${stepId}`, { method: 'DELETE' })
		router.refresh()
	}

	return (
		<div className="flex justify-end gap-2">
			<Link href={`/admin/steps/${stepId}`}>
				<Button variant="outline" size="sm" type="button">
					Edit
				</Button>
			</Link>
			<Button variant="destructive" size="sm" onClick={handleDelete}>
				Delete
			</Button>
		</div>
	)
}

import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'

import { StepEditor } from './step-editor'

interface PageProps {
	params: Promise<{ id: string }>
}

export default async function AdminStepEditPage({ params }: PageProps) {
	const session = await auth()
	if (!session || session.user.role !== 'SUPER_ADMIN') redirect('/login')

	const { id } = await params
	const stepId = Number(id)
	if (Number.isNaN(stepId)) notFound()

	const step = await prisma.step.findUnique({
		where: { id: stepId },
		include: { blocks: { orderBy: { order: 'asc' } } },
	})
	if (!step) notFound()

	return (
		<div className="font-body mx-auto max-w-2xl p-6">
			<Link href="/admin" className="mb-4 inline-block text-sm text-[#6B6555]">
				← К списку
			</Link>
			<h1 className="font-display mb-6 text-2xl font-semibold">
				Редактирование шага {step.order}
			</h1>
			<StepEditor step={step} />
		</div>
	)
}

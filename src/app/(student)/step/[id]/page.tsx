import { notFound, redirect } from 'next/navigation'

import { auth } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'
import { StepReader } from '@/widgets/step-reader'

interface PageProps {
	params: Promise<{ id: string }>
}

export default async function StepPage({ params }: PageProps) {
	const session = await auth()
	if (!session || session.user.role !== 'STUDENT') redirect('/login')

	const { id } = await params
	const stepId = Number(id)
	if (Number.isNaN(stepId)) notFound()

	const step = await prisma.step.findUnique({
		where: { id: stepId, isPublished: true },
		include: { blocks: { orderBy: { order: 'asc' } } },
	})
	if (!step) notFound()

	const totalPublished = await prisma.step.count({ where: { isPublished: true } })

	const next = await prisma.step.findFirst({
		where: { isPublished: true, order: { gt: step.order } },
		orderBy: { order: 'asc' },
		select: { id: true },
	})

	return (
		<StepReader
			step={{ ...step, totalPublished }}
			nextStepId={next?.id ?? null}
		/>
	)
}

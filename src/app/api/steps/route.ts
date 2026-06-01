import { NextResponse } from 'next/server'

import { auth } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'

export async function GET() {
	const session = await auth()
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const totalPublished = await prisma.step.count({ where: { isPublished: true } })

	const steps = await prisma.step.findMany({
		where: { isPublished: true },
		orderBy: { order: 'asc' },
		select: { id: true, order: true, title: true, subtitle: true },
	})

	if (session.user.role !== 'STUDENT') {
		return NextResponse.json({ steps, totalPublished })
	}

	const progress = await prisma.progress.findMany({
		where: { studentId: Number(session.user.id) },
		select: { stepId: true },
	})
	const completedIds = new Set(progress.map((p) => p.stepId))

	let foundCurrent = false
	const result = steps.map((step) => {
		if (completedIds.has(step.id)) return { ...step, status: 'completed' as const }
		if (!foundCurrent) {
			foundCurrent = true
			return { ...step, status: 'current' as const }
		}
		return { ...step, status: 'locked' as const }
	})

	return NextResponse.json({ steps: result, totalPublished })
}

export async function POST(req: Request) {
	const session = await auth()
	if (session?.user.role !== 'SUPER_ADMIN') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const body = await req.json()
	const maxOrder = await prisma.step.aggregate({ _max: { order: true } })
	const nextOrder = (maxOrder._max.order ?? 0) + 1

	const step = await prisma.step.create({
		data: {
			order: nextOrder,
			title: body.title,
			subtitle: body.subtitle,
		},
	})
	return NextResponse.json(step)
}

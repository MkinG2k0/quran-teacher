import { NextResponse } from 'next/server'

import { auth } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'

export async function POST(req: Request) {
	const session = await auth()
	if (session?.user.role !== 'STUDENT') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const { stepId } = await req.json()
	const record = await prisma.progress.upsert({
		where: {
			studentId_stepId: {
				studentId: Number(session.user.id),
				stepId,
			},
		},
		update: {},
		create: {
			studentId: Number(session.user.id),
			stepId,
		},
	})
	return NextResponse.json(record)
}

export async function GET() {
	const session = await auth()
	if (session?.user.role !== 'STUDENT') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const progress = await prisma.progress.findMany({
		where: { studentId: Number(session.user.id) },
		orderBy: { completedAt: 'desc' },
	})
	return NextResponse.json(progress)
}

import { NextResponse } from 'next/server'

import { auth } from '@/shared/lib/auth'
import { generateAccessCode } from '@/shared/lib/code'
import { prisma } from '@/shared/lib/prisma'

export async function GET() {
	const session = await auth()
	if (session?.user.role !== 'TEACHER') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const totalPublished = await prisma.step.count({ where: { isPublished: true } })

	const students = await prisma.user.findMany({
		where: { teacherId: Number(session.user.id), role: 'STUDENT' },
		include: {
			progress: {
				include: { step: { select: { order: true } } },
				orderBy: { completedAt: 'desc' },
			},
		},
	})

	const now = Date.now()
	const result = students.map((s) => {
		const completed = s.progress.length
		const lastActivity = s.progress[0]?.completedAt ?? null
		const diffDays = lastActivity
			? (now - new Date(lastActivity).getTime()) / 86400000
			: 999
		const status =
			diffDays <= 1 ? 'active' : diffDays <= 4 ? 'idle' : 'lost'
		const maxOrder = s.progress.reduce(
			(max, p) => Math.max(max, p.step.order),
			0
		)

		return {
			id: s.id,
			name: s.name,
			age: s.age,
			accessCode: s.accessCode,
			completedSteps: completed,
			currentStepOrder: maxOrder + 1,
			lastActivity,
			status,
		}
	})

	return NextResponse.json({ students: result, totalPublished })
}

export async function POST(req: Request) {
	const session = await auth()
	if (session?.user.role !== 'TEACHER') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const { name, age } = await req.json()
	let code: string
	let attempts = 0
	do {
		code = generateAccessCode()
		attempts++
	} while (
		(await prisma.user.findUnique({ where: { accessCode: code } })) &&
		attempts < 10
	)

	const student = await prisma.user.create({
		data: {
			name,
			age,
			accessCode: code,
			role: 'STUDENT',
			teacherId: Number(session.user.id),
		},
	})
	return NextResponse.json(student)
}

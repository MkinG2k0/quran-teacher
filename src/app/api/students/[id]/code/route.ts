import { NextResponse } from 'next/server'

import { auth } from '@/shared/lib/auth'
import { generateAccessCode } from '@/shared/lib/code'
import { prisma } from '@/shared/lib/prisma'

type RouteParams = { params: Promise<{ id: string }> }

export async function POST(_: Request, { params }: RouteParams) {
	const session = await auth()
	if (session?.user.role !== 'TEACHER') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const { id } = await params
	const student = await prisma.user.findFirst({
		where: { id: Number(id), teacherId: Number(session.user.id) },
	})
	if (!student) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 })
	}

	const newCode = generateAccessCode()
	const updated = await prisma.user.update({
		where: { id: student.id },
		data: { accessCode: newCode },
	})
	return NextResponse.json({ accessCode: updated.accessCode })
}

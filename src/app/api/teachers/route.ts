import { NextResponse } from 'next/server'

import { auth } from '@/shared/lib/auth'
import { generateAccessCode } from '@/shared/lib/code'
import { prisma } from '@/shared/lib/prisma'

export async function GET() {
	const session = await auth()
	if (session?.user.role !== 'SUPER_ADMIN') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const teachers = await prisma.user.findMany({
		where: { role: 'TEACHER' },
		include: { _count: { select: { students: true } } },
	})
	return NextResponse.json(teachers)
}

export async function POST(req: Request) {
	const session = await auth()
	if (session?.user.role !== 'SUPER_ADMIN') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const { name, age } = await req.json()
	const code = generateAccessCode()
	const teacher = await prisma.user.create({
		data: { name, age, accessCode: code, role: 'TEACHER' },
	})
	return NextResponse.json(teacher)
}

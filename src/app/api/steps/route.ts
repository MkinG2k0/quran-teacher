import { NextResponse } from 'next/server'

import { auth } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'

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

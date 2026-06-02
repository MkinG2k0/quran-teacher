import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams
	const page = Math.max(1, Number(searchParams.get('page')) || 1)
	const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 50))
	const skip = (page - 1) * limit
	const where = { isPublished: true }

	const [steps, totalPublished] = await Promise.all([
		prisma.step.findMany({
			where,
			orderBy: { order: 'asc' },
			skip,
			take: limit,
			select: { id: true, order: true, title: true, subtitle: true },
		}),
		prisma.step.count({ where }),
	])

	const totalPages = Math.max(1, Math.ceil(totalPublished / limit))

	return NextResponse.json({
		steps,
		totalPublished,
		page,
		limit,
		totalPages,
	})
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

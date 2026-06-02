import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/shared/lib/prisma'

export async function GET(req: NextRequest) {
	const excludeParam = req.nextUrl.searchParams.get('exclude')
	const excludeIds = excludeParam
		? excludeParam
				.split(',')
				.map((value) => Number(value))
				.filter((value) => Number.isInteger(value) && value > 0)
		: []

	const step = await prisma.step.findFirst({
		where: {
			isPublished: true,
			...(excludeIds.length > 0 && { id: { notIn: excludeIds } }),
		},
		orderBy: { order: 'asc' },
		select: { id: true, order: true, title: true, subtitle: true },
	})

	return NextResponse.json({ step: step ?? null })
}

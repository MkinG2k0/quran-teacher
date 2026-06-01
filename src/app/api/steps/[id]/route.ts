import { NextResponse } from 'next/server'

import { auth } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: RouteParams) {
	const session = await auth()
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id } = await params
	const step = await prisma.step.findUnique({
		where: { id: Number(id) },
		include: { blocks: { orderBy: { order: 'asc' } } },
	})
	if (!step) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 })
	}

	const totalPublished = await prisma.step.count({ where: { isPublished: true } })

	return NextResponse.json({ ...step, totalPublished })
}

export async function PATCH(req: Request, { params }: RouteParams) {
	const session = await auth()
	if (session?.user.role !== 'SUPER_ADMIN') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const { id } = await params
	const { title, subtitle, isPublished, blocks } = await req.json()

	const step = await prisma.step.update({
		where: { id: Number(id) },
		data: { title, subtitle, isPublished },
	})

	if (blocks) {
		await prisma.block.deleteMany({ where: { stepId: step.id } })
		await prisma.block.createMany({
			data: blocks.map(
				(
					b: {
						type: string
						value?: string
						imageUrl?: string
						caption?: string
						translation?: string
					},
					i: number
				) => ({
					stepId: step.id,
					order: i,
					type: b.type,
					value: b.value ?? null,
					imageUrl: b.imageUrl ?? null,
					caption: b.caption ?? null,
					translation: b.translation ?? null,
				})
			),
		})
	}

	const updated = await prisma.step.findUnique({
		where: { id: step.id },
		include: { blocks: { orderBy: { order: 'asc' } } },
	})

	return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: RouteParams) {
	const session = await auth()
	if (session?.user.role !== 'SUPER_ADMIN') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const { id } = await params
	await prisma.step.delete({ where: { id: Number(id) } })
	return NextResponse.json({ ok: true })
}

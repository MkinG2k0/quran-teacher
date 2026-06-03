import { NextResponse } from 'next/server'

import { buildOfflineProgramBundle } from '@/shared/lib/offline-program/build-bundle'
import { prisma } from '@/shared/lib/prisma'

export async function GET() {
	const bundle = await buildOfflineProgramBundle(prisma)
	return NextResponse.json(bundle, {
		headers: {
			'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
		},
	})
}

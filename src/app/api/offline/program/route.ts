import { NextResponse } from 'next/server'

import {
	buildProgramBundleFromDatabase,
	readProgramBundleFromFile,
	writeProgramBundleToFile,
} from '@/shared/lib/offline-program/program-file.server'
import { prisma } from '@/shared/lib/prisma'

/**
 * Legacy API: по умолчанию отдаёт public/offline/program.json.
 * ?source=db — пересборка из БД и перезапись JSON (миграция).
 */
export async function GET(req: Request) {
	const source = new URL(req.url).searchParams.get('source')

	if (source === 'db') {
		const bundle = await buildProgramBundleFromDatabase(prisma)
		await writeProgramBundleToFile(bundle)
		return NextResponse.json(bundle, {
			headers: { 'Cache-Control': 'no-store' },
		})
	}

	const bundle = await readProgramBundleFromFile()
	if (!bundle) {
		return NextResponse.json(
			{ error: 'Файл программы не найден. Запустите pnpm offline:bundle' },
			{ status: 404 },
		)
	}

	return NextResponse.json(bundle, {
		headers: {
			'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
		},
	})
}

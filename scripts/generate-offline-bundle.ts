import 'dotenv/config'
import { createHash } from 'node:crypto'

import { buildOfflineProgramBundle } from '../src/shared/lib/offline-program/build-bundle'
import { writeProgramBundleToFile } from '../src/shared/lib/offline-program/program-file.server'
import { createPrismaClient } from '../src/shared/lib/create-prisma-client'

async function main() {
	const prisma = createPrismaClient()

	try {
		const bundle = await buildOfflineProgramBundle(prisma)
		await writeProgramBundleToFile(bundle)
		const json = JSON.stringify(bundle)

		const revision = createHash('md5').update(json).digest('hex')
		console.log(
			`Офлайн-бандл: ${bundle.totalPublished} шагов, ${bundle.assetUrls.length} медиа, revision=${revision}`,
		)
	} catch (error) {
		console.warn('Не удалось сгенерировать офлайн-бандл:', error)
		const fallback = {
			version: 'empty',
			generatedAt: new Date().toISOString(),
			totalPublished: 0,
			steps: [],
			assetUrls: [],
		}
		await writeProgramBundleToFile(fallback)
	} finally {
		await prisma.$disconnect()
	}
}

main()

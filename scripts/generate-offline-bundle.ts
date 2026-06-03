import 'dotenv/config'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { buildOfflineProgramBundle } from '../src/shared/lib/offline-program/build-bundle'
import { createPrismaClient } from '../src/shared/lib/create-prisma-client'

const OUT_DIR = path.join(process.cwd(), 'public', 'offline')
const OUT_FILE = path.join(OUT_DIR, 'program.json')

async function main() {
	const prisma = createPrismaClient()

	try {
		const bundle = await buildOfflineProgramBundle(prisma)
		await mkdir(OUT_DIR, { recursive: true })
		const json = JSON.stringify(bundle)
		await writeFile(OUT_FILE, json, 'utf8')

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
		await mkdir(OUT_DIR, { recursive: true })
		await writeFile(OUT_FILE, JSON.stringify(fallback), 'utf8')
	} finally {
		await prisma.$disconnect()
	}
}

main()

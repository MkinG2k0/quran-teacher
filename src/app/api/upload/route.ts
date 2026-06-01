import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

import { NextResponse } from 'next/server'

import { auth } from '@/shared/lib/auth'

export async function POST(req: Request) {
	const session = await auth()
	if (session?.user.role !== 'SUPER_ADMIN') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const data = await req.formData()
	const file = data.get('file') as File | null
	if (!file) {
		return NextResponse.json({ error: 'No file' }, { status: 400 })
	}

	const bytes = await file.arrayBuffer()
	const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
	const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
	await mkdir(uploadsDir, { recursive: true })
	const filepath = path.join(uploadsDir, filename)
	await writeFile(filepath, Buffer.from(bytes))

	return NextResponse.json({ imageUrl: `/uploads/${filename}` })
}

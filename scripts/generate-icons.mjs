import sharp from 'sharp'
import { mkdir } from 'fs/promises'

await mkdir('public/icons', { recursive: true })

async function makeIcon(size, file) {
	const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0D1117"/>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-size="${Math.round(size * 0.4)}" fill="#C9A84C">Q</text>
</svg>`
	await sharp(Buffer.from(svg)).png().toFile(file)
}

await makeIcon(192, 'public/icons/icon-192.png')
await makeIcon(512, 'public/icons/icon-512.png')
console.log('icons generated')

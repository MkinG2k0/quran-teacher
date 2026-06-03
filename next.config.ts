import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'

import withPWA from '@ducanh2912/next-pwa'
import type { NextConfig } from 'next'

function getOfflineProgramRevision(): string | null {
	const filePath = 'public/offline/program.json'
	if (!existsSync(filePath)) return null
	return createHash('md5').update(readFileSync(filePath)).digest('hex')
}

const offlineProgramRevision = getOfflineProgramRevision()

const withPWAConfig = withPWA({
	dest: 'public',
	// В dev PWA + webpack → бесконечная пересборка; офлайн-тест: pnpm build && pnpm start
	disable: process.env.NODE_ENV === 'development',
	register: true,
	cacheStartUrl: true,
	reloadOnOnline: true,
	fallbacks: {
		document: '/',
	},
	workboxOptions: {
		skipWaiting: true,
		clientsClaim: true,
		// Кэшированная главная, не /~offline (иначе router.replace → цикл ?_rsc)
		navigateFallback: '/',
		navigateFallbackDenylist: [/^\/api\//, /^\/admin/, /^\/login/, /^\/teacher/],
		additionalManifestEntries: offlineProgramRevision
			? [{ url: '/offline/program.json', revision: offlineProgramRevision }]
			: [],
		runtimeCaching: [
			{
				urlPattern: /^\/offline\/program\.json$/,
				handler: 'CacheFirst',
				options: {
					cacheName: 'offline-program-static',
					expiration: { maxEntries: 1 },
				},
			},
			{
				urlPattern: /^\/api\/offline\/program/,
				handler: 'StaleWhileRevalidate',
				options: {
					cacheName: 'api-offline-program',
					expiration: { maxEntries: 2 },
				},
			},
			{
				urlPattern: /^\/$/,
				handler: 'NetworkFirst',
				options: {
					cacheName: 'student-home',
					networkTimeoutSeconds: 2,
				},
			},
			{
				urlPattern: /^\/api\/auth\/session/,
				handler: 'NetworkOnly',
			},
			{
				urlPattern: /\/uploads\/.+/,
				handler: 'CacheFirst',
				options: {
					cacheName: 'uploads',
					expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 30 },
				},
			},
			{
				urlPattern: /^https:\/\/upload\.wikimedia\.org\/.+/,
				handler: 'CacheFirst',
				options: {
					cacheName: 'external-images',
					expiration: { maxEntries: 100 },
				},
			},
		],
	},
})

const nextConfig: NextConfig = {
	turbopack: {},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'upload.wikimedia.org',
				pathname: '/**',
			},
		],
	},
}

export default withPWAConfig(nextConfig)

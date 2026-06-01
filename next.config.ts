import withPWA from '@ducanh2912/next-pwa'
import type { NextConfig } from 'next'

const withPWAConfig = withPWA({
	dest: 'public',
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: false,
	workboxOptions: {
		runtimeCaching: [
			{
				urlPattern: /^\/step\/.*/,
				handler: 'CacheFirst',
				options: { cacheName: 'steps-pages', expiration: { maxEntries: 600 } },
			},
			{
				urlPattern: /^\/api\/steps.*/,
				handler: 'NetworkFirst',
				options: { cacheName: 'api-steps', networkTimeoutSeconds: 5 },
			},
			{
				urlPattern: /\/uploads\/.+/,
				handler: 'CacheFirst',
				options: { cacheName: 'uploads', expiration: { maxEntries: 1000 } },
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

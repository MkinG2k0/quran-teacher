import { Cormorant_Garamond, Mulish } from 'next/font/google'
import type { Metadata, Viewport } from 'next'

import { Toaster } from '@/shared/ui/sonner'
import { UnregisterSwInDev } from '@/shared/ui/unregister-sw-in-dev'
import { Providers } from '@/shared/providers'

import './globals.css'

const mulish = Mulish({
	variable: '--font-body',
	subsets: ['latin', 'cyrillic'],
	display: 'swap',
})

const cormorant = Cormorant_Garamond({
	variable: '--font-display',
	subsets: ['latin', 'cyrillic'],
	weight: ['300', '400', '600', '700'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Чтение Корана',
	description: 'Платформа обучения чтению Корана',
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		title: 'Коран',
	},
}

export const viewport: Viewport = {
	themeColor: '#0D1117',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="ru"
			className={`${mulish.variable} ${cormorant.variable}`}
			suppressHydrationWarning
		>
			<body className="font-body bg-[#0D1117] text-[#E8E0D0] antialiased">
				<UnregisterSwInDev />
				<Providers>
					{children}
					<Toaster richColors position="top-center" />
				</Providers>
			</body>
		</html>
	)
}

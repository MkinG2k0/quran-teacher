import { Golos_Text, Roboto } from 'next/font/google'
import { Toaster } from '@/shared/ui/sonner'
import { Providers } from '@/shared/providers'

import './globals.css'

const roboto = Roboto({
	variable: '--font-roboto',
	weight: ['400', '500', '700'],
	subsets: ['latin', 'cyrillic'],
	display: 'swap',
})

const golosText = Golos_Text({
	variable: '--font-golos',
	subsets: ['latin', 'cyrillic'],
	display: 'swap',
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const fontVariables = `${roboto.variable} ${golosText.variable} `

	return (
		<html lang="ru" className={fontVariables} suppressHydrationWarning>
		<body className="font-sans antialiased">
		<Providers>

			{children}
			<script defer src="https://cloud.umami.is/script.js" data-website-id="ce6e779f-5d90-4585-a9be-67e26cf39432"></script>
			<Toaster richColors position="top-center"/>
		</Providers>
		</body>
		</html>
	)
}

import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'

import { Providers } from '@/providers/Providers'

import './globals.css'

const notoSans = Noto_Sans({
	variable: '--font-noto-sans',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: {
		absolute: 'Video Portal',
		template: `%s | Video Portal`
	},
	description: 'Best app for video watching'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${notoSans.variable} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}

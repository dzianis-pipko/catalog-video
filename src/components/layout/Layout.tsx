import { type PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren<unknown>) => {

	return (
		<main
			className={'flex min-h-screen justify-center'}
		>
			{children}
		</main>
	)
}

export default Layout

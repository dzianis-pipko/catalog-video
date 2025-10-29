import { type PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren<unknown>) => {

	return (
		<main
			className={'flex min-h-screen'}
		>
			<section className='p-layout'>{children}</section>
		</main>
	)
}

export default Layout

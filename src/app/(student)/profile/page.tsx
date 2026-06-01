import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/shared/lib/auth'
import { signOut } from '@/shared/lib/auth'
import { Button } from '@/shared/ui/button'

export default async function ProfilePage() {
	const session = await auth()
	if (!session || session.user.role !== 'STUDENT') redirect('/login')

	return (
		<div
			className="font-body mx-auto flex min-h-screen max-w-md flex-col gap-6 p-6"
			style={{ background: '#0D1117', color: '#E8E0D0' }}
		>
			<Link href="/" className="text-sm text-[#6B6555]">
				← На главную
			</Link>
			<div>
				<p className="text-xs uppercase tracking-widest text-[#4A4540]">Профиль</p>
				<h1 className="font-display text-2xl font-semibold">{session.user.name}</h1>
			</div>
			<form
				action={async () => {
					'use server'
					await signOut({ redirectTo: '/login' })
				}}
			>
				<Button type="submit" variant="outline" className="w-full">
					Выйти
				</Button>
			</form>
		</div>
	)
}

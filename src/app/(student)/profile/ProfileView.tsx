'use client'

import Link from 'next/link'

import { FontSizePicker } from '@/features/font-settings'

export function ProfileView() {
	return (
		<div
			className="font-body mx-auto flex min-h-screen max-w-md flex-col gap-6 p-6"
			style={{ background: '#0D1117', color: '#E8E0D0' }}
		>
			<Link href="/" className="text-sm text-[#6B6555]">
				← На главную
			</Link>
			<div>
				<p className="text-xs uppercase tracking-widest text-[var(--quran-fg-secondary)]">
					Настройки
				</p>
				<h1 className="font-display text-2xl font-semibold">Чтение</h1>
			</div>

			<section>
				<p
					className="font-body mb-3 text-xs uppercase tracking-widest"
					style={{ color: 'var(--quran-fg-secondary)' }}
				>
					Размер шрифта
				</p>
				<FontSizePicker />
				<p
					className="font-body mt-2"
					style={{ fontSize: 11, color: 'var(--quran-fg-muted)' }}
				>
					Применяется к урокам и списку шагов на этом устройстве
				</p>
			</section>
		</div>
	)
}

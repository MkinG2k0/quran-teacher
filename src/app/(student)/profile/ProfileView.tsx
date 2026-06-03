'use client'

import Link from 'next/link'

import { FontSizePicker } from '@/features/font-settings'
import { ThemePicker } from '@/features/theme-settings'

export function ProfileView() {
	return (
		<div className="font-body mx-auto flex min-h-screen max-w-md flex-col gap-6 p-6">
			<Link
				href="/"
				className="text-sm"
				style={{ color: 'var(--quran-fg-secondary)' }}
			>
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

			<section>
				<p
					className="font-body mb-3 text-xs uppercase tracking-widest"
					style={{ color: 'var(--quran-fg-secondary)' }}
				>
					Тема оформления
				</p>
				<ThemePicker />
				<p
					className="font-body mt-2"
					style={{ fontSize: 11, color: 'var(--quran-fg-muted)' }}
				>
					Тёмная, светлая или сепия — для комфортного чтения
				</p>
			</section>
		</div>
	)
}

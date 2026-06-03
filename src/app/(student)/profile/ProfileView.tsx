'use client'

import Link from 'next/link'

import { FontSizePicker } from '@/features/font-settings'
import { ThemePicker } from '@/features/theme-settings'
import { qColors, qText } from '@/shared/lib/quran-tailwind'
import { cn } from '@/shared/lib/utils'

export function ProfileView() {
	return (
		<div className="font-body mx-auto flex min-h-screen max-w-md flex-col gap-6 p-6">
			<Link href="/" className={cn('text-sm', qColors.fgSecondary)}>
				← На главную
			</Link>
			<div>
				<p
					className={cn(
						'text-xs uppercase tracking-widest',
						qColors.fgSecondary,
					)}
				>
					Настройки
				</p>
				<h1 className="font-display text-2xl font-semibold">Чтение</h1>
			</div>

			<section>
				<p
					className={cn(
						'font-body mb-3 text-xs uppercase tracking-widest',
						qColors.fgSecondary,
					)}
				>
					Размер шрифта
				</p>
				<FontSizePicker />
				<p className={cn('font-body mt-2', qText(11), qColors.fgMuted)}>
					Применяется к урокам и списку шагов на этом устройстве
				</p>
			</section>

			<section>
				<p
					className={cn(
						'font-body mb-3 text-xs uppercase tracking-widest',
						qColors.fgSecondary,
					)}
				>
					Тема оформления
				</p>
				<ThemePicker />
				<p className={cn('font-body mt-2', qText(11), qColors.fgMuted)}>
					Тёмная, светлая или сепия — для комфортного чтения
				</p>
			</section>
		</div>
	)
}

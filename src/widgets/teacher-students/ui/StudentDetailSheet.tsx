'use client'

import { useCallback, useEffect, useState } from 'react'

import { qColors, qGradientAccent, qText } from '@/shared/lib/quran-tailwind'
import { cn } from '@/shared/lib/utils'
import { formatRelativeActivity } from '@/shared/lib/format-relative'
import { StudentAvatar } from '@/shared/ui/student-avatar'

import type { TeacherStudentRow } from './TeacherStudents'

const statusColor = { active: '#78C040', idle: '#C9A84C', lost: '#C04040' }
const statusLabel = { active: 'Активен', idle: 'Неактивен', lost: 'Отстаёт' }

interface StudentDetailSheetProps {
	student: TeacherStudentRow
	totalPublished: number
	onClose: () => void
}

export function StudentDetailSheet({
	student,
	totalPublished,
	onClose,
}: StudentDetailSheetProps) {
	const [copied, setCopied] = useState(false)

	const pct =
		totalPublished > 0
			? Math.round((student.completedSteps / totalPublished) * 100)
			: 0

	const handleCopyCode = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(student.accessCode)
			setCopied(true)
			window.setTimeout(() => setCopied(false), 2000)
		} catch {
			/* ignore */
		}
	}, [student.accessCode])

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		document.addEventListener('keydown', onKey)
		document.body.style.overflow = 'hidden'
		return () => {
			document.removeEventListener('keydown', onKey)
			document.body.style.overflow = ''
		}
	}, [onClose])

	return (
		<div
			role="presentation"
			onClick={onClose}
			className="fixed inset-0 z-50 flex items-end justify-center bg-black/65"
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="student-detail-title"
				className="quran-fade-up max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl border-t border-[#2A2418] bg-[#0D1117] px-5 pt-5 pb-7"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="mx-auto mb-5 h-1 w-9 rounded-sm bg-[var(--quran-surface)]" />

				<div className="mb-5 flex items-start gap-3.5">
					<StudentAvatar name={student.name} size={48} />
					<div className="min-w-0 flex-1">
						<h2
							id="student-detail-title"
							className={cn(
								'font-display mb-1.5 font-semibold text-[#E8E0D0]',
								qText(20),
							)}
						>
							{student.name}
						</h2>
						<div className="flex items-center gap-2">
							<span
								className="size-2 rounded-full"
								style={{
									background: statusColor[student.status],
									boxShadow: `0 0 8px ${statusColor[student.status]}66`,
								}}
							/>
							<span className={cn('font-body text-[#6B6555]', qText(12))}>
								{statusLabel[student.status]}
								{student.age != null && (
									<span className={qColors.fgSubtle}> · {student.age} лет</span>
								)}
							</span>
						</div>
					</div>
					<button
						type="button"
						className={cn(
							'font-body size-8 cursor-pointer rounded-lg border border-[#222] bg-[#141414] leading-none text-[#6B6555]',
							qText(16),
						)}
						onClick={onClose}
						aria-label="Закрыть"
					>
						×
					</button>
				</div>

				<div className="mb-4 rounded-xl border border-[#2A2418] bg-[#101010] px-[18px] py-4 text-center">
					<p
						className={cn(
							'font-body mb-2 tracking-[0.2em] uppercase',
							qText(10),
							qColors.fgSecondary,
						)}
					>
						Код доступа
					</p>
					<p
						className={cn(
							'font-display font-semibold tracking-[0.25em] text-[#C9A84C] leading-none',
							qText(36),
						)}
					>
						{student.accessCode}
					</p>
					<p className={cn('font-body mt-2.5', qText(11), qColors.fgSubtle)}>
						Передайте код ученику для входа в приложение
					</p>
					<button
						type="button"
						className={cn(
							'font-body mt-3.5 w-full cursor-pointer rounded-[10px] border-none px-4 py-2.5 font-semibold text-[#0D1117]',
							qText(12),
							copied
								? 'bg-[linear-gradient(135deg,#4A7A30,#78C040)]'
								: qGradientAccent,
						)}
						onClick={handleCopyCode}
					>
						{copied ? 'Скопировано' : 'Скопировать код'}
					</button>
				</div>

				<div className="grid grid-cols-2 gap-2.5">
					{[
						{
							label: 'Прогресс',
							value: `${pct}%`,
							sub: `${student.completedSteps} из ${totalPublished} шагов`,
						},
						{
							label: 'Текущий шаг',
							value: String(student.currentStepOrder),
							sub: `из ${totalPublished}`,
						},
						{
							label: 'Активность',
							value: formatRelativeActivity(student.lastActivity),
							sub: 'последний визит',
						},
						{
							label: 'Завершено',
							value: String(student.completedSteps),
							sub: 'шагов пройдено',
						},
					].map((item) => (
						<div
							key={item.label}
							className="rounded-[10px] border border-[#181818] bg-[#101010] px-3.5 py-3"
						>
							<p
								className={cn(
									'font-body mb-1 tracking-wide uppercase',
									qText(9),
									qColors.fgSubtle,
								)}
							>
								{item.label}
							</p>
							<p
								className={cn(
									'font-display leading-tight font-semibold text-[#C9A84C]',
									qText(18),
								)}
							>
								{item.value}
							</p>
							<p
								className={cn(
									'font-body mt-0.5',
									qText(10),
									qColors.fgSecondary,
								)}
							>
								{item.sub}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

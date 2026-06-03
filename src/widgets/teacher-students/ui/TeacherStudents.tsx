'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { qColors, qGradientAccent, qText } from '@/shared/lib/quran-tailwind'
import { cn } from '@/shared/lib/utils'
import { formatRelativeActivity } from '@/shared/lib/format-relative'
import { GeomPattern } from '@/shared/ui/geom-pattern'
import { StudentAvatar } from '@/shared/ui/student-avatar'

import { StudentDetailSheet } from './StudentDetailSheet'

export interface TeacherStudentRow {
	id: number
	name: string
	age: number | null
	accessCode: string
	completedSteps: number
	currentStepOrder: number
	lastActivity: string | null
	status: 'active' | 'idle' | 'lost'
}

interface TeacherStudentsProps {
	students: TeacherStudentRow[]
	totalPublished: number
}

const FILTERS = ['Все', 'Активные', 'Неактивные', 'Отстают'] as const

const statusColor = { active: '#78C040', idle: '#C9A84C', lost: '#C04040' }
const statusLabel = { active: 'Активен', idle: 'Неактивен', lost: 'Отстаёт' }

function MiniBar({ pct }: { pct: number }) {
	return (
		<div className="h-[3px] w-full overflow-hidden rounded-sm bg-[#1A1A1A]">
			<div
				className={cn(
					'h-full rounded-sm',
					pct > 30 && 'bg-[linear-gradient(90deg,#4A7A30,#78C040)]',
					pct > 10 && pct <= 30 && 'bg-[linear-gradient(90deg,#8B6914,#C9A84C)]',
					pct <= 10 && 'bg-[#3A2020]',
				)}
				style={{ width: `${pct}%` }}
			/>
		</div>
	)
}

export function TeacherStudents({ students, totalPublished }: TeacherStudentsProps) {
	const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Все')
	const [search, setSearch] = useState('')
	const [sort, setSort] = useState('step_desc')
	const [selectedStudent, setSelectedStudent] = useState<TeacherStudentRow | null>(
		null
	)

	const filtered = useMemo(() => {
		return students
			.filter((s) => {
				if (filter === 'Активные') return s.status === 'active'
				if (filter === 'Неактивные') return s.status === 'idle'
				if (filter === 'Отстают') return s.status === 'lost'
				return true
			})
			.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
			.sort((a, b) => {
				if (sort === 'step_desc') return b.currentStepOrder - a.currentStepOrder
				if (sort === 'step_asc') return a.currentStepOrder - b.currentStepOrder
				if (sort === 'name') return a.name.localeCompare(b.name)
				return 0
			})
	}, [students, filter, search, sort])

	const activeCount = students.filter((s) => s.status === 'active').length
	const avgStep =
		students.length > 0
			? Math.round(
					students.reduce((a, s) => a + s.currentStepOrder, 0) / students.length
				)
			: 0

	return (
		<div className="relative mx-auto min-h-screen max-w-[520px] bg-[#0D1117] text-[#E8E0D0]">
			<GeomPattern opacity={0.03} />

			<header className="sticky top-0 z-10 border-b border-[#181818] bg-[rgba(13,17,23,0.97)] px-5 pt-5 pb-4 backdrop-blur-md">
				<div className="mb-4 flex items-start justify-between">
					<div>
						<p
							className={cn(
								'font-body mb-0.5 tracking-[0.2em] uppercase',
								qText(10),
								qColors.fgSecondary,
							)}
						>
							Кабинет учителя
						</p>
						<h1
							className={cn(
								'font-display font-semibold text-[#E8E0D0]',
								qText(24),
							)}
						>
							Мои ученики
						</h1>
					</div>
					<Link
						href="/teacher/new"
						className={cn(
							'font-body whitespace-nowrap rounded-[10px] px-4 py-2.5 font-semibold text-[#0D1117] no-underline',
							qGradientAccent,
							qText(12),
						)}
					>
						+ Добавить
					</Link>
				</div>

				<div className="mb-3.5 flex gap-2.5">
					{[
						{ label: 'Всего', value: students.length },
						{ label: 'Активны сегодня', value: activeCount, accent: true },
						{ label: 'Средний шаг', value: avgStep },
					].map((stat) => (
						<div
							key={stat.label}
							className={cn(
								'flex-1 rounded-[10px] bg-[#0F0F0F] px-3 py-2.5 text-center',
								stat.accent
									? 'border border-[rgba(120,192,64,0.2)]'
									: 'border border-[#181818]',
							)}
						>
							<p
								className={cn(
									'font-display leading-none font-semibold',
									qText(22),
									stat.accent ? 'text-[#78C040]' : 'text-[#C9A84C]',
								)}
							>
								{stat.value}
							</p>
							<p
								className={cn(
									'font-body mt-0.5 tracking-wide uppercase',
									qText(9),
									qColors.fgSubtle,
								)}
							>
								{stat.label.toUpperCase()}
							</p>
						</div>
					))}
				</div>

				<div className="relative mb-3">
					<span
						className={cn(
							'pointer-events-none absolute top-1/2 left-3 -translate-y-1/2',
							qText(13),
							qColors.fgSubtle,
						)}
					>
						⌕
					</span>
					<input
						className={cn(
							'font-body w-full rounded-[10px] border border-[#1E1E1E] bg-[#111] py-2.5 pr-3.5 pl-9 text-[#E8E0D0] outline-none',
							qText(13),
						)}
						placeholder="Поиск по имени..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<div className="flex items-center gap-2 overflow-x-auto">
					<div className="flex flex-1 gap-1.5">
						{FILTERS.map((f) => (
							<button
								key={f}
								type="button"
								className={cn(
									'font-body cursor-pointer rounded-full px-3 py-1.5 whitespace-nowrap',
									qText(11),
									filter === f
										? cn('border-none font-semibold text-[#0D1117]', qGradientAccent)
										: cn('border border-[#222] bg-[#111] font-normal', qColors.fgSecondary),
								)}
								onClick={() => setFilter(f)}
							>
								{f}
							</button>
						))}
					</div>
					<select
						className={cn(
							'font-body cursor-pointer rounded-lg border border-[#222] bg-[#141414] px-2.5 py-1.5 text-[#6B6555] outline-none',
							qText(11),
						)}
						value={sort}
						onChange={(e) => setSort(e.target.value)}
					>
						<option value="step_desc">По прогрессу ↓</option>
						<option value="step_asc">По прогрессу ↑</option>
						<option value="name">По имени</option>
					</select>
				</div>
			</header>

			<main className="px-4 pt-3 pb-8">
				{filtered.length === 0 ? (
					<div
						className={cn(
							'font-body px-5 py-[60px] text-center',
							qColors.fgMuted,
						)}
					>
						Нет учеников по фильтру
					</div>
				) : (
					<div className="flex flex-col gap-1.5">
						{filtered.map((s, i) => {
							const pct =
								totalPublished > 0
									? Math.round((s.completedSteps / totalPublished) * 100)
									: 0

							return (
								<button
									key={s.id}
									type="button"
									className="quran-card-enter w-full cursor-pointer rounded-xl border border-[#181818] bg-[#101010] p-3.5 text-left"
									style={{ animationDelay: `${i * 0.04}s` }}
									onClick={() => setSelectedStudent(s)}
								>
									<div className="flex items-center gap-3">
										<StudentAvatar name={s.name} />

										<div className="min-w-0 flex-1">
											<div className="mb-1 flex items-center gap-2">
												<p
													className={cn(
														'font-body truncate font-semibold text-[#D8D0C0]',
														qText(13),
													)}
												>
													{s.name}
												</p>
												<span
													className="size-1.5 shrink-0 rounded-full"
													style={{
														background: statusColor[s.status],
														boxShadow: `0 0 6px ${statusColor[s.status]}66`,
													}}
												/>
											</div>

											<MiniBar pct={pct} />

											<div className="mt-1.5 flex items-center gap-3">
												<span className={cn('font-body text-[#C9A84C]', qText(11))}>
													Шаг {s.currentStepOrder}
													<span className={qColors.fgSubtle}>
														{' '}
														/ {totalPublished}
													</span>
												</span>
												<span
													className={cn(
														'font-body ml-auto',
														qText(11),
														qColors.fgSubtle,
													)}
												>
													{formatRelativeActivity(s.lastActivity)}
												</span>
											</div>
										</div>

										<div className="shrink-0 text-right">
											<p
												className={cn(
													'font-display leading-none font-semibold',
													qText(20),
													pct > 30
														? 'text-[#78C040]'
														: pct > 10
															? 'text-[#C9A84C]'
															: 'text-[#5A3A3A]',
												)}
											>
												{pct}%
											</p>
											<p
												className={cn(
													'font-body mt-0.5 uppercase',
													qText(9),
													qColors.fgMuted,
												)}
											>
												{statusLabel[s.status].toUpperCase()}
											</p>
										</div>
									</div>
								</button>
							)
						})}
					</div>
				)}

				{filtered.length > 0 && (
					<p
						className={cn(
							'font-body mt-5 text-center tracking-wide text-[#1E1E1E]',
							qText(10),
						)}
					>
						{filtered.length} из {students.length} учеников
					</p>
				)}
			</main>

			{selectedStudent && (
				<StudentDetailSheet
					student={selectedStudent}
					totalPublished={totalPublished}
					onClose={() => setSelectedStudent(null)}
				/>
			)}
		</div>
	)
}

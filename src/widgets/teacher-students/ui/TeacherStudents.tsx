'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { fontPx } from '@/features/font-settings/lib/constants'
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
		<div
			style={{
				height: 3,
				background: '#1A1A1A',
				borderRadius: 2,
				overflow: 'hidden',
				width: '100%',
			}}
		>
			<div
				style={{
					height: '100%',
					borderRadius: 2,
					width: `${pct}%`,
					background:
						pct > 30
							? 'linear-gradient(90deg, #4A7A30, #78C040)'
							: pct > 10
								? 'linear-gradient(90deg, #8B6914, #C9A84C)'
								: '#3A2020',
				}}
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
		<div
			style={{
				minHeight: '100vh',
				background: '#0D1117',
				color: '#E8E0D0',
				position: 'relative',
				maxWidth: 520,
				margin: '0 auto',
			}}
		>
			<GeomPattern opacity={0.03} />

			<header
				style={{
					padding: '20px 20px 16px',
					position: 'sticky',
					top: 0,
					zIndex: 10,
					background: 'rgba(13,17,23,0.97)',
					backdropFilter: 'blur(10px)',
					borderBottom: '1px solid #181818',
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						marginBottom: 16,
					}}
				>
					<div>
						<p
							className="font-body"
							style={{
								fontSize: fontPx(10),
								color: 'var(--quran-fg-secondary)',
								letterSpacing: 2,
								textTransform: 'uppercase',
								marginBottom: 3,
							}}
						>
							Кабинет учителя
						</p>
						<h1
							className="font-display"
							style={{ fontSize: fontPx(24), fontWeight: 600, color: '#E8E0D0' }}
						>
							Мои ученики
						</h1>
					</div>
					<Link
						href="/teacher/new"
						className="font-body"
						style={{
							background: 'linear-gradient(135deg, #8B6914, #C9A84C)',
							border: 'none',
							borderRadius: 10,
							padding: '10px 16px',
							color: '#0D1117',
							fontSize: fontPx(12),
							fontWeight: 600,
							textDecoration: 'none',
							whiteSpace: 'nowrap',
						}}
					>
						+ Добавить
					</Link>
				</div>

				<div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
					{[
						{ label: 'Всего', value: students.length },
						{ label: 'Активны сегодня', value: activeCount, accent: true },
						{ label: 'Средний шаг', value: avgStep },
					].map((stat) => (
						<div
							key={stat.label}
							style={{
								flex: 1,
								background: '#0F0F0F',
								border: `1px solid ${stat.accent ? 'rgba(120,192,64,0.2)' : '#181818'}`,
								borderRadius: 10,
								padding: '10px 12px',
								textAlign: 'center',
							}}
						>
							<p
								className="font-display"
								style={{
									fontSize: fontPx(22),
									fontWeight: 600,
									color: stat.accent ? '#78C040' : '#C9A84C',
									lineHeight: 1,
								}}
							>
								{stat.value}
							</p>
							<p
								className="font-body"
								style={{
									fontSize: fontPx(9),
									color: 'var(--quran-fg-subtle)',
									marginTop: 3,
									letterSpacing: 1,
								}}
							>
								{stat.label.toUpperCase()}
							</p>
						</div>
					))}
				</div>

				<div style={{ position: 'relative', marginBottom: 12 }}>
					<span
						style={{
							position: 'absolute',
							left: 12,
							top: '50%',
							transform: 'translateY(-50%)',
							color: 'var(--quran-fg-subtle)',
							fontSize: fontPx(13),
							pointerEvents: 'none',
						}}
					>
						⌕
					</span>
					<input
						className="font-body"
						placeholder="Поиск по имени..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={{
							background: '#111',
							border: '1px solid #1E1E1E',
							color: '#E8E0D0',
							borderRadius: 10,
							padding: '10px 14px 10px 36px',
							fontSize: fontPx(13),
							width: '100%',
							outline: 'none',
						}}
					/>
				</div>

				<div
					style={{
						display: 'flex',
						gap: 8,
						alignItems: 'center',
						overflowX: 'auto',
					}}
				>
					<div style={{ display: 'flex', gap: 6, flex: 1 }}>
						{FILTERS.map((f) => (
							<button
								key={f}
								type="button"
								className="font-body"
								onClick={() => setFilter(f)}
								style={{
									padding: '5px 12px',
									borderRadius: 20,
									fontSize: fontPx(11),
									border: filter === f ? 'none' : '1px solid #222',
									background:
										filter === f
											? 'linear-gradient(135deg, #8B6914, #C9A84C)'
											: '#111',
									color: filter === f ? '#0D1117' : 'var(--quran-fg-secondary)',
									fontWeight: filter === f ? 600 : 400,
									cursor: 'pointer',
									whiteSpace: 'nowrap',
								}}
							>
								{f}
							</button>
						))}
					</div>
					<select
						className="font-body"
						value={sort}
						onChange={(e) => setSort(e.target.value)}
						style={{
							background: '#141414',
							border: '1px solid #222',
							color: '#6B6555',
							borderRadius: 8,
							padding: '6px 10px',
							fontSize: fontPx(11),
							cursor: 'pointer',
							outline: 'none',
						}}
					>
						<option value="step_desc">По прогрессу ↓</option>
						<option value="step_asc">По прогрессу ↑</option>
						<option value="name">По имени</option>
					</select>
				</div>
			</header>

			<main style={{ padding: '12px 16px 32px' }}>
				{filtered.length === 0 ? (
					<div
						className="font-body"
						style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--quran-fg-muted)' }}
					>
						Нет учеников по фильтру
					</div>
				) : (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
						{filtered.map((s, i) => {
							const pct =
								totalPublished > 0
									? Math.round((s.completedSteps / totalPublished) * 100)
									: 0

							return (
								<button
									key={s.id}
									type="button"
									className="quran-card-enter"
									onClick={() => setSelectedStudent(s)}
									style={{
										background: '#101010',
										border: '1px solid #181818',
										borderRadius: 12,
										padding: 14,
										animationDelay: `${i * 0.04}s`,
										width: '100%',
										textAlign: 'left',
										cursor: 'pointer',
									}}
								>
									<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
										<StudentAvatar name={s.name} />

										<div style={{ flex: 1, minWidth: 0 }}>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: 8,
													marginBottom: 4,
												}}
											>
												<p
													className="font-body"
													style={{
														fontSize: fontPx(13),
														fontWeight: 600,
														color: '#D8D0C0',
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}}
												>
													{s.name}
												</p>
												<span
													style={{
														width: 6,
														height: 6,
														borderRadius: '50%',
														flexShrink: 0,
														background: statusColor[s.status],
														boxShadow: `0 0 6px ${statusColor[s.status]}66`,
													}}
												/>
											</div>

											<MiniBar pct={pct} />

											<div
												style={{
													display: 'flex',
													gap: 12,
													marginTop: 6,
													alignItems: 'center',
												}}
											>
												<span
													className="font-body"
													style={{ fontSize: fontPx(11), color: '#C9A84C' }}
												>
													Шаг {s.currentStepOrder}
													<span style={{ color: 'var(--quran-fg-subtle)' }}>
														{' '}
														/ {totalPublished}
													</span>
												</span>
												<span
													className="font-body"
													style={{
														fontSize: fontPx(11),
														color: 'var(--quran-fg-subtle)',
														marginLeft: 'auto',
													}}
												>
													{formatRelativeActivity(s.lastActivity)}
												</span>
											</div>
										</div>

										<div style={{ textAlign: 'right', flexShrink: 0 }}>
											<p
												className="font-display"
												style={{
													fontSize: fontPx(20),
													fontWeight: 600,
													color:
														pct > 30
															? '#78C040'
															: pct > 10
																? '#C9A84C'
																: '#5A3A3A',
													lineHeight: 1,
												}}
											>
												{pct}%
											</p>
											<p
												className="font-body"
												style={{
													fontSize: fontPx(9),
													color: 'var(--quran-fg-muted)',
													marginTop: 2,
												}}
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
						className="font-body"
						style={{
							textAlign: 'center',
							fontSize: fontPx(10),
							color: '#1E1E1E',
							marginTop: 20,
							letterSpacing: 1,
						}}
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

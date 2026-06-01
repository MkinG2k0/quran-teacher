'use client'

import { useCallback, useEffect, useState } from 'react'

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
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 50,
				background: 'rgba(0,0,0,0.65)',
				display: 'flex',
				alignItems: 'flex-end',
				justifyContent: 'center',
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="student-detail-title"
				className="quran-fade-up"
				onClick={(e) => e.stopPropagation()}
				style={{
					width: '100%',
					maxWidth: 520,
					maxHeight: '88vh',
					overflowY: 'auto',
					background: '#0D1117',
					borderTop: '1px solid #2A2418',
					borderRadius: '16px 16px 0 0',
					padding: '20px 20px 28px',
				}}
			>
				<div
					style={{
						width: 36,
						height: 4,
						borderRadius: 2,
						background: '#2A2520',
						margin: '0 auto 20px',
					}}
				/>

				<div
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						gap: 14,
						marginBottom: 20,
					}}
				>
					<StudentAvatar name={student.name} size={48} />
					<div style={{ flex: 1, minWidth: 0 }}>
						<h2
							id="student-detail-title"
							className="font-display"
							style={{
								fontSize: 20,
								fontWeight: 600,
								color: '#E8E0D0',
								marginBottom: 6,
							}}
						>
							{student.name}
						</h2>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<span
								style={{
									width: 8,
									height: 8,
									borderRadius: '50%',
									background: statusColor[student.status],
									boxShadow: `0 0 8px ${statusColor[student.status]}66`,
								}}
							/>
							<span className="font-body" style={{ fontSize: 12, color: '#6B6555' }}>
								{statusLabel[student.status]}
								{student.age != null && (
									<span style={{ color: '#3A3530' }}> · {student.age} лет</span>
								)}
							</span>
						</div>
					</div>
					<button
						type="button"
						className="font-body"
						onClick={onClose}
						aria-label="Закрыть"
						style={{
							background: '#141414',
							border: '1px solid #222',
							borderRadius: 8,
							width: 32,
							height: 32,
							color: '#6B6555',
							cursor: 'pointer',
							fontSize: 16,
							lineHeight: 1,
						}}
					>
						×
					</button>
				</div>

				<div
					style={{
						background: '#101010',
						border: '1px solid #2A2418',
						borderRadius: 12,
						padding: '16px 18px',
						textAlign: 'center',
						marginBottom: 16,
					}}
				>
					<p
						className="font-body"
						style={{
							fontSize: 10,
							color: '#4A4540',
							letterSpacing: 2,
							textTransform: 'uppercase',
							marginBottom: 8,
						}}
					>
						Код доступа
					</p>
					<p
						className="font-display"
						style={{
							fontSize: 36,
							fontWeight: 600,
							letterSpacing: '0.25em',
							color: '#C9A84C',
							lineHeight: 1,
						}}
					>
						{student.accessCode}
					</p>
					<p className="font-body" style={{ fontSize: 11, color: '#3A3530', marginTop: 10 }}>
						Передайте код ученику для входа в приложение
					</p>
					<button
						type="button"
						className="font-body"
						onClick={handleCopyCode}
						style={{
							marginTop: 14,
							width: '100%',
							padding: '10px 16px',
							borderRadius: 10,
							border: 'none',
							cursor: 'pointer',
							fontSize: 12,
							fontWeight: 600,
							background: copied
								? 'linear-gradient(135deg, #4A7A30, #78C040)'
								: 'linear-gradient(135deg, #8B6914, #C9A84C)',
							color: '#0D1117',
						}}
					>
						{copied ? 'Скопировано' : 'Скопировать код'}
					</button>
				</div>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: 10,
					}}
				>
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
							style={{
								background: '#101010',
								border: '1px solid #181818',
								borderRadius: 10,
								padding: '12px 14px',
							}}
						>
							<p
								className="font-body"
								style={{
									fontSize: 9,
									color: '#3A3530',
									letterSpacing: 1,
									textTransform: 'uppercase',
									marginBottom: 4,
								}}
							>
								{item.label}
							</p>
							<p
								className="font-display"
								style={{
									fontSize: 18,
									fontWeight: 600,
									color: '#C9A84C',
									lineHeight: 1.1,
								}}
							>
								{item.value}
							</p>
							<p className="font-body" style={{ fontSize: 10, color: '#4A4540', marginTop: 3 }}>
								{item.sub}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

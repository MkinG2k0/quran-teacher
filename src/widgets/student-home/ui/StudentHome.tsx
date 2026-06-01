'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import type { StepListItem } from '@/entities/step'
import { GeomPattern } from '@/shared/ui/geom-pattern'

interface StudentHomeProps {
	userName: string
	steps: StepListItem[]
	totalPublished: number
}

export function StudentHome({ userName, steps, totalPublished }: StudentHomeProps) {
	const router = useRouter()
	const completedCount = steps.filter((s) => s.status === 'completed').length
	const progressPct =
		totalPublished > 0 ? Math.round((completedCount / totalPublished) * 100) : 0
	const currentStep = steps.find((s) => s.status === 'current')

	const handleStepClick = (step: StepListItem) => {
		if (step.status === 'locked') return
		router.push(`/step/${step.id}`)
	}

	return (
		<div
			style={{
				minHeight: '100vh',
				background: '#0D1117',
				color: '#E8E0D0',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<GeomPattern />
			<div
				style={{
					position: 'absolute',
					top: '-200px',
					right: '-200px',
					width: '600px',
					height: '600px',
					borderRadius: '50%',
					background:
						'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
					pointerEvents: 'none',
				}}
			/>

			<header
				style={{
					padding: '20px 24px 0',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					position: 'relative',
					zIndex: 1,
				}}
			>
				<div>
					<p
						className="font-body"
						style={{
							color: '#6B6555',
							fontSize: 11,
							letterSpacing: 2,
							textTransform: 'uppercase',
							marginBottom: 2,
						}}
					>
						Ассаламу алейкум
					</p>
					<h1
						className="font-display"
						style={{ fontSize: 22, fontWeight: 600, color: '#E8E0D0' }}
					>
						{userName}
					</h1>
				</div>
				<Link
					href="/profile"
					style={{
						width: 40,
						height: 40,
						borderRadius: '50%',
						background: 'linear-gradient(135deg, #1E1A14, #2A2418)',
						border: '1px solid #2A2418',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#C9A84C',
						fontSize: 15,
						textDecoration: 'none',
					}}
				>
					ا
				</Link>
			</header>

			<div
				className="font-display"
				style={{
					textAlign: 'center',
					color: '#C9A84C',
					fontSize: 26,
					padding: '16px 0 8px',
					opacity: 0.7,
					letterSpacing: 4,
					position: 'relative',
					zIndex: 1,
				}}
			>
				﷽
			</div>

			<main
				style={{
					padding: '0 20px 32px',
					position: 'relative',
					zIndex: 1,
					maxWidth: 480,
					margin: '0 auto',
				}}
			>
				<div
					style={{
						background: 'linear-gradient(135deg, #131A10, #1A1208)',
						border: '1px solid #2A2418',
						borderRadius: 16,
						padding: 20,
						marginBottom: 16,
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-end',
							marginBottom: 12,
						}}
					>
						<div>
							<p
								className="font-body"
								style={{
									fontSize: 10,
									color: '#5A5548',
									letterSpacing: 2,
									textTransform: 'uppercase',
									marginBottom: 4,
								}}
							>
								Общий прогресс
							</p>
							<p
								className="font-display"
								style={{ fontSize: 36, color: '#C9A84C', lineHeight: 1 }}
							>
								{completedCount}
								<span style={{ fontSize: 16, color: '#5A5548', marginLeft: 4 }}>
									/ {totalPublished}
								</span>
							</p>
						</div>
						<p
							className="font-display"
							style={{ fontSize: 42, color: '#1E2218', fontWeight: 700 }}
						>
							{progressPct}%
						</p>
					</div>
					<div
						style={{
							background: '#0D1117',
							borderRadius: 4,
							height: 6,
							overflow: 'hidden',
						}}
					>
						<div
							className="quran-progress-fill"
							style={{ width: `${progressPct}%`, height: '100%' }}
						/>
					</div>
					<p
						className="font-body"
						style={{ fontSize: 11, color: '#3A3530', marginTop: 8 }}
					>
						{totalPublished - completedCount} шагов до завершения программы
					</p>
				</div>

				{currentStep && (
					<div style={{ marginBottom: 24 }}>
						<button
							type="button"
							className="continue-btn"
							onClick={() => handleStepClick(currentStep)}
							style={{
								width: '100%',
								padding: '16px 20px',
								border: 'none',
								borderRadius: 12,
								cursor: 'pointer',
								textAlign: 'left',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								background: 'linear-gradient(135deg, #8B6914, #C9A84C)',
							}}
						>
							<div>
								<p
									className="font-body"
									style={{
										fontSize: 10,
										letterSpacing: 2,
										textTransform: 'uppercase',
										color: 'rgba(0,0,0,0.5)',
										marginBottom: 4,
									}}
								>
									Продолжить
								</p>
								<p
									className="font-display"
									style={{ fontSize: 17, color: '#0D1117', fontWeight: 700 }}
								>
									Шаг {currentStep.order} — {currentStep.title}
								</p>
								{currentStep.subtitle && (
									<p
										className="font-body"
										style={{
											fontSize: 12,
											color: 'rgba(0,0,0,0.45)',
											marginTop: 2,
										}}
									>
										{currentStep.subtitle}
									</p>
								)}
							</div>
							<span style={{ fontSize: 20, color: '#0D1117', opacity: 0.6 }}>→</span>
						</button>
					</div>
				)}

				<div>
					<p
						className="font-body"
						style={{
							fontSize: 10,
							color: '#4A4540',
							letterSpacing: 2,
							textTransform: 'uppercase',
							marginBottom: 12,
						}}
					>
						Программа обучения
					</p>

					<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
						{steps.map((step) => {
							const isLocked = step.status === 'locked'
							const isCurrent = step.status === 'current'
							const isCompleted = step.status === 'completed'

							return (
								<div
									key={step.id}
									role="button"
									tabIndex={isLocked ? -1 : 0}
									onClick={() => handleStepClick(step)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') handleStepClick(step)
									}}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 14,
										padding: '12px 14px',
										borderRadius: 10,
										background: isCurrent
											? 'linear-gradient(135deg, #131A10, #1A1E10)'
											: '#101010',
										border: isCurrent
											? '1px solid rgba(201,168,76,0.35)'
											: '1px solid #181818',
										opacity: isLocked ? 0.35 : 1,
										cursor: isLocked ? 'default' : 'pointer',
										boxShadow: isCurrent
											? '0 0 16px rgba(201,168,76,0.12)'
											: undefined,
									}}
								>
									<div
										className={isCurrent ? 'quran-badge-current' : ''}
										style={{
											width: 32,
											height: 32,
											borderRadius: '50%',
											flexShrink: 0,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											background: isCompleted
												? 'linear-gradient(135deg, #2A3A20, #3A5228)'
												: isCurrent
													? 'linear-gradient(135deg, #2A2010, #3A2E10)'
													: '#181818',
											border: isCompleted
												? '1px solid #4A7A30'
												: isCurrent
													? '1px solid #C9A84C'
													: '1px solid #282828',
											fontSize: 11,
											color: isCompleted
												? '#6ABB40'
												: isCurrent
													? '#C9A84C'
													: '#3A3530',
										}}
									>
										{isCompleted ? '✓' : isLocked ? '🔒' : step.order}
									</div>

									<div style={{ flex: 1, minWidth: 0 }}>
										<p
											className="font-body"
											style={{
												fontSize: 13,
												fontWeight: 600,
												color: isCompleted
													? '#7A7060'
													: isCurrent
														? '#E8E0D0'
														: '#4A4540',
												whiteSpace: 'nowrap',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
											}}
										>
											{step.title}
										</p>
										{step.subtitle && (
											<p
												className="font-body"
												style={{
													fontSize: 11,
													color: isCompleted
														? '#3A3530'
														: isCurrent
															? '#8A7A60'
															: '#2A2520',
													marginTop: 1,
												}}
											>
												{step.subtitle}
											</p>
										)}
									</div>

									<span
										className="font-body"
										style={{ fontSize: 10, color: '#2A2520', flexShrink: 0 }}
									>
										{step.order}
									</span>
								</div>
							)
						})}

						{totalPublished > steps.length && (
							<div
								className="font-body"
								style={{
									textAlign: 'center',
									padding: 16,
									color: '#2A2520',
									fontSize: 12,
								}}
							>
								· · · ещё {totalPublished - steps.length} шагов · · ·
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	)
}

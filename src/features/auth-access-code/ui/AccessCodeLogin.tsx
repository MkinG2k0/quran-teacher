'use client'

import Link from 'next/link'

import { GeomPattern } from '@/shared/ui/geom-pattern'

import { useAccessCodeLogin } from '../model/use-access-code-login'

export function AccessCodeLogin() {
	const {
		digits,
		status,
		shake,
		inputsRef,
		filled,
		handleDigit,
		handleKeyDown,
		handlePaste,
		borderColor,
		bgColor,
	} = useAccessCodeLogin()

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				background: '#0D1117',
				position: 'relative',
				overflow: 'hidden',
				padding: '24px',
			}}
		>
			<GeomPattern />

			<div
				style={{
					position: 'absolute',
					top: '20%',
					left: '50%',
					transform: 'translateX(-50%)',
					width: '400px',
					height: '400px',
					borderRadius: '50%',
					background:
						'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
					pointerEvents: 'none',
				}}
			/>

			{status === 'success' ? (
				<div
					className="quran-success-pop"
					style={{ textAlign: 'center', maxWidth: '300px' }}
				>
					<div
						className="font-display"
						style={{
							fontSize: '64px',
							color: '#78C040',
							marginBottom: '8px',
							lineHeight: 1,
						}}
					>
						✓
					</div>
					<h2
						className="font-display"
						style={{
							fontSize: '30px',
							fontWeight: 600,
							color: '#E8E0D0',
							marginBottom: '8px',
						}}
					>
						Добро пожаловать!
					</h2>
					<p
						className="font-body"
						style={{ fontSize: '13px', color: '#4A4540', lineHeight: 1.7 }}
					>
						Переходим в личный кабинет...
					</p>
				</div>
			) : (
				<div style={{ width: '100%', maxWidth: '360px', textAlign: 'center' }}>
					<div
						className="font-display quran-fade-up"
						style={{
							fontSize: '36px',
							color: '#C9A84C',
							opacity: 0.5,
							letterSpacing: '8px',
							marginBottom: '28px',
						}}
					>
						﷽
					</div>

					<h1
						className="font-display quran-fade-up"
						style={{
							fontSize: '32px',
							fontWeight: 600,
							color: '#E8E0D0',
							marginBottom: '8px',
						}}
					>
						Введите код входа
					</h1>
					<p
						className="font-body quran-fade-up"
						style={{
							fontSize: '13px',
							color: '#4A4540',
							lineHeight: 1.6,
							marginBottom: '36px',
						}}
					>
						Шестизначный код выдаёт ваш учитель
					</p>

					<div
						className={shake ? 'quran-shake' : ''}
						style={{
							display: 'flex',
							gap: '8px',
							justifyContent: 'center',
							marginBottom: '12px',
						}}
						onPaste={handlePaste}
					>
						{digits.map((d, i) => (
							<input
								key={i}
								ref={(el) => {
									inputsRef.current[i] = el
								}}
								className="quran-fade-up font-display"
								type="text"
								inputMode="numeric"
								maxLength={1}
								value={d}
								onChange={(e) => handleDigit(i, e.target.value)}
								onKeyDown={(e) => handleKeyDown(i, e)}
								style={{
									width: 46,
									height: 58,
									textAlign: 'center',
									fontSize: 22,
									fontWeight: 600,
									color: '#E8E0D0',
									borderRadius: 12,
									outline: 'none',
									caretColor: '#C9A84C',
									background: bgColor(i),
									border: `1px solid ${borderColor(i)}`,
									animationDelay: `${0.18 + i * 0.05}s`,
								}}
								autoFocus={i === 0}
							/>
						))}
					</div>

					<div
						style={{
							height: 20,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							marginBottom: 28,
						}}
					>
						{status === 'checking' && <span className="quran-spinner" />}
						{status === 'error' && (
							<p
								className="font-body"
								style={{ fontSize: 12, color: '#8B2020', letterSpacing: 1 }}
							>
								Неверный код. Попробуйте снова.
							</p>
						)}
						{status === 'idle' && filled && (
							<p className="font-body" style={{ fontSize: 12, color: '#3A3530' }}>
								Проверяем...
							</p>
						)}
					</div>

					<p
						className="font-body quran-fade-up"
						style={{ fontSize: 11, color: '#2A2520', lineHeight: 1.7 }}
					>
						Нет кода? Обратитесь к своему учителю.
					</p>

					<div
						style={{
							marginTop: 40,
							paddingTop: 20,
							borderTop: '1px solid #181818',
						}}
					>
						<Link
							href="/login"
							className="font-body"
							style={{
								fontSize: 11,
								color: '#3A3530',
								textDecoration: 'none',
								letterSpacing: 1,
							}}
						>
							Я учитель →
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}

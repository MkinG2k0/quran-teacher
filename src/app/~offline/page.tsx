'use client'

/**
 * Запасная страница (явный переход на /~offline).
 * Не редиректим на главную — иначе офлайн-цикл с router.replace и ?_rsc.
 */
export default function OfflineFallbackPage() {
	const openHome = () => {
		window.location.href = '/'
	}

	return (
		<div
			className="font-body"
			style={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 16,
				padding: 24,
				textAlign: 'center',
				color: '#8A8070',
				background: '#0D1117',
			}}
		>
			<p style={{ maxWidth: 320, lineHeight: 1.5 }}>
				Нет сети. Откройте приложение онлайн хотя бы один раз, затем снова зайдите на главную.
			</p>
			<button
				type="button"
				onClick={openHome}
				style={{
					padding: '10px 20px',
					borderRadius: 8,
					border: '1px solid #2A2418',
					background: '#141414',
					color: '#E8E0D0',
					cursor: 'pointer',
				}}
			>
				На главную
			</button>
		</div>
	)
}

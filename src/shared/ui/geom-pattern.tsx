'use client'

import { useId } from 'react'

interface GeomPatternProps {
	opacity?: number
}

export function GeomPattern({ opacity }: GeomPatternProps) {
	const patternId = useId().replace(/:/g, '')

	return (
		<svg
			width="100%"
			height="100%"
			xmlns="http://www.w3.org/2000/svg"
			className={opacity == null ? 'quran-geom-pattern' : undefined}
			style={{
				position: 'absolute',
				inset: 0,
				...(opacity != null ? { opacity } : {}),
				pointerEvents: 'none',
			}}
			aria-hidden
		>
			<defs>
				<pattern
					id={patternId}
					x="0"
					y="0"
					width="60"
					height="60"
					patternUnits="userSpaceOnUse"
				>
					<polygon
						points="30,2 58,17 58,43 30,58 2,43 2,17"
						fill="none"
						stroke="var(--quran-accent, #C9A84C)"
						strokeWidth="0.8"
					/>
					<polygon
						points="30,12 48,22 48,38 30,48 12,38 12,22"
						fill="none"
						stroke="var(--quran-accent, #C9A84C)"
						strokeWidth="0.5"
					/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${patternId})`} />
		</svg>
	)
}

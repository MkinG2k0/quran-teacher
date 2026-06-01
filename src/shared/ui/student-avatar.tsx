interface StudentAvatarProps {
	name: string
	size?: number
}

export function StudentAvatar({ name, size = 38 }: StudentAvatarProps) {
	const initials = name
		.split(' ')
		.map((w) => w[0])
		.slice(0, 2)
		.join('')
	const hue = name.charCodeAt(0) * 17 % 360

	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: '50%',
				flexShrink: 0,
				background: `hsl(${hue}, 25%, 18%)`,
				border: `1px solid hsl(${hue}, 30%, 25%)`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: size * 0.35,
				color: `hsl(${hue}, 50%, 65%)`,
				fontFamily: 'var(--font-display), Georgia, serif',
				fontWeight: 600,
			}}
		>
			{initials}
		</div>
	)
}

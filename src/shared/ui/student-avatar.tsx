import { FONT_BASE_OFFSET } from '@/features/font-settings/lib/constants'
import { cn } from '@/shared/lib/utils'

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
	const fontSize = size * 0.35 + FONT_BASE_OFFSET

	return (
		<div
			className={cn(
				'flex shrink-0 items-center justify-center rounded-full font-display font-semibold',
				`bg-[hsl(${hue}_25%_18%)] border border-[hsl(${hue}_30%_25%)] text-[hsl(${hue}_50%_65%)]`,
			)}
			style={{ width: size, height: size, fontSize }}
		>
			{initials}
		</div>
	)
}

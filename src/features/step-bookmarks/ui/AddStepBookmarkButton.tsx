'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'

import { useFontSettings } from '@/features/font-settings'
import { headerIconButtonClass } from '@/shared/lib/quran-tailwind'

import { useStepBookmarks } from '../model/use-step-bookmarks'

interface AddStepBookmarkButtonProps {
	stepId: number
	order: number
	title: string
}

export function AddStepBookmarkButton({
	stepId,
	order,
	title,
}: AddStepBookmarkButtonProps) {
	const { px } = useFontSettings()
	const { toggleBookmark, isBookmarkedAtCurrentScroll } = useStepBookmarks()
	const saved = isBookmarkedAtCurrentScroll(stepId)

	const handleToggle = () => {
		toggleBookmark({ stepId, order, title })
	}

	return (
		<button
			type="button"
			onClick={handleToggle}
			aria-label={saved ? 'Убрать закладку' : 'Добавить закладку'}
			title={saved ? 'Убрать закладку' : 'Добавить закладку'}
			className={headerIconButtonClass(saved)}
		>
			{saved ? (
				<BookmarkCheck size={px(16)} strokeWidth={1.75} />
			) : (
				<Bookmark size={px(16)} strokeWidth={1.75} />
			)}
		</button>
	)
}

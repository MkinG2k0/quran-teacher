'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'

import { useFontSettings } from '@/features/font-settings'

import { useStepBookmarks } from '../model/use-step-bookmarks'
import { headerIconButtonStyle } from './header-icon-button-styles'

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
			style={headerIconButtonStyle(px, saved)}
		>
			{saved ? (
				<BookmarkCheck size={px(16)} strokeWidth={1.75} />
			) : (
				<Bookmark size={px(16)} strokeWidth={1.75} />
			)}
		</button>
	)
}

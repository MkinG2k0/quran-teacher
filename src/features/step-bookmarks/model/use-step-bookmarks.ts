'use client'

import { useCallback, useEffect, useState } from 'react'

import { getStepScroll } from '@/shared/lib/student-ui-state-storage'

import {
	addStepBookmark,
	findBookmarkAtPosition,
	readStepBookmarks,
	removeStepBookmark,
} from '../lib/bookmarks-storage'
import { BOOKMARKS_CHANGE_EVENT } from '../lib/constants'
import type { StepBookmark } from './types'

export function useStepBookmarks() {
	const [bookmarks, setBookmarks] = useState<StepBookmark[]>([])

	const refresh = useCallback(() => {
		setBookmarks(readStepBookmarks())
	}, [])

	useEffect(() => {
		refresh()
		const onChange = () => refresh()
		window.addEventListener(BOOKMARKS_CHANGE_EVENT, onChange)
		return () => window.removeEventListener(BOOKMARKS_CHANGE_EVENT, onChange)
	}, [refresh])

	const toggleBookmark = useCallback(
		(input: { stepId: number; order: number; title: string }) => {
			const scrollTop = getStepScroll(input.stepId)
			const existing = findBookmarkAtPosition(input.stepId, scrollTop)
			if (existing) {
				removeStepBookmark(existing.id)
				return false
			}
			addStepBookmark({ ...input, scrollTop })
			return true
		},
		[],
	)

	const isBookmarkedAtCurrentScroll = useCallback(
		(stepId: number) => {
			const scrollTop = getStepScroll(stepId)
			return Boolean(findBookmarkAtPosition(stepId, scrollTop, bookmarks))
		},
		[bookmarks],
	)

	const removeBookmark = useCallback((id: string) => {
		removeStepBookmark(id)
	}, [])

	return {
		bookmarks,
		toggleBookmark,
		isBookmarkedAtCurrentScroll,
		removeBookmark,
	}
}

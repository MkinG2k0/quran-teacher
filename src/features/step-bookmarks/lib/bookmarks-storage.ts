import {
	BOOKMARK_SCROLL_TOLERANCE,
	BOOKMARKS_CHANGE_EVENT,
	BOOKMARKS_STORAGE_KEY,
	MAX_STEP_BOOKMARKS,
} from './constants'
import type { StepBookmark } from '../model/types'

function bookmarkId(stepId: number, scrollTop: number) {
	const bucket = Math.round(scrollTop / BOOKMARK_SCROLL_TOLERANCE)
	return `${stepId}-${bucket}`
}

function parseBookmarks(raw: string): StepBookmark[] {
	try {
		const parsed = JSON.parse(raw) as unknown
		if (!Array.isArray(parsed)) return []
		return parsed.filter(
			(item): item is StepBookmark =>
				typeof item === 'object' &&
				item !== null &&
				typeof (item as StepBookmark).id === 'string' &&
				typeof (item as StepBookmark).stepId === 'number' &&
				typeof (item as StepBookmark).order === 'number' &&
				typeof (item as StepBookmark).title === 'string' &&
				typeof (item as StepBookmark).scrollTop === 'number' &&
				typeof (item as StepBookmark).createdAt === 'number',
		)
	} catch {
		return []
	}
}

export function readStepBookmarks(): StepBookmark[] {
	if (typeof window === 'undefined') return []
	try {
		const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY)
		if (!raw) return []
		return parseBookmarks(raw).sort((a, b) => b.createdAt - a.createdAt)
	} catch {
		return []
	}
}

function writeStepBookmarks(bookmarks: StepBookmark[]) {
	localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks))
	window.dispatchEvent(new Event(BOOKMARKS_CHANGE_EVENT))
}

export function findBookmarkAtPosition(
	stepId: number,
	scrollTop: number,
	bookmarks = readStepBookmarks(),
): StepBookmark | undefined {
	return bookmarks.find(
		(b) =>
			b.stepId === stepId &&
			Math.abs(b.scrollTop - scrollTop) < BOOKMARK_SCROLL_TOLERANCE,
	)
}

export function addStepBookmark(input: {
	stepId: number
	order: number
	title: string
	scrollTop: number
}): StepBookmark | null {
	const scrollTop = Math.max(0, input.scrollTop)
	const bookmarks = readStepBookmarks()
	const existing = findBookmarkAtPosition(input.stepId, scrollTop, bookmarks)
	if (existing) return existing

	const next: StepBookmark = {
		id: bookmarkId(input.stepId, scrollTop),
		stepId: input.stepId,
		order: input.order,
		title: input.title,
		scrollTop,
		createdAt: Date.now(),
	}

	const withoutDup = bookmarks.filter((b) => b.id !== next.id)
	writeStepBookmarks([next, ...withoutDup].slice(0, MAX_STEP_BOOKMARKS))
	return next
}

export function removeStepBookmark(id: string): void {
	const bookmarks = readStepBookmarks().filter((b) => b.id !== id)
	writeStepBookmarks(bookmarks)
}

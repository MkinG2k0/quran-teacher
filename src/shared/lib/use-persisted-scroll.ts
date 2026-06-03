'use client'

import {
	useEffect,
	useLayoutEffect,
	useRef,
	type RefObject,
} from 'react'

import { consumePendingStepScroll } from './pending-step-scroll'
import { getHomeScroll, setHomeScroll, setStepScroll } from './student-ui-state-storage'

export function useHomeWindowScroll(page: number, ready: boolean) {
	const pageRef = useRef(page)
	pageRef.current = page
	const restoredRef = useRef(false)

	useLayoutEffect(() => {
		if (!ready || restoredRef.current) return
		restoredRef.current = true
		window.scrollTo(0, getHomeScroll(pageRef.current))
	}, [ready])

	useEffect(() => {
		let raf = 0
		const onScroll = () => {
			cancelAnimationFrame(raf)
			raf = requestAnimationFrame(() => {
				setHomeScroll(pageRef.current, window.scrollY)
			})
		}
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener('scroll', onScroll)
			setHomeScroll(pageRef.current, window.scrollY)
		}
	}, [page])
}

function getScrollTop(scrollRef?: RefObject<HTMLElement | null>): number {
	const el = scrollRef?.current
	return el ? el.scrollTop : window.scrollY
}

function scrollToTop(scrollRef?: RefObject<HTMLElement | null>) {
	const el = scrollRef?.current
	if (el) el.scrollTop = 0
	else window.scrollTo(0, 0)
}

export function useStepWindowScroll(
	stepId: number,
	scrollRef?: RefObject<HTMLElement | null>,
) {
	useLayoutEffect(() => {
		const restore = consumePendingStepScroll(stepId)
		if (restore != null && restore > 0) {
			const el = scrollRef?.current
			if (el) el.scrollTop = restore
			else window.scrollTo(0, restore)
			setStepScroll(stepId, restore)
			return
		}
		scrollToTop(scrollRef)
		setStepScroll(stepId, 0)
	}, [stepId, scrollRef])

	useEffect(() => {
		const el = scrollRef?.current
		let raf = 0
		const onScroll = () => {
			cancelAnimationFrame(raf)
			raf = requestAnimationFrame(() => {
				setStepScroll(stepId, getScrollTop(scrollRef))
			})
		}

		if (el) {
			el.addEventListener('scroll', onScroll, { passive: true })
			return () => {
				cancelAnimationFrame(raf)
				el.removeEventListener('scroll', onScroll)
				setStepScroll(stepId, el.scrollTop)
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener('scroll', onScroll)
			setStepScroll(stepId, window.scrollY)
		}
	}, [stepId, scrollRef])
}

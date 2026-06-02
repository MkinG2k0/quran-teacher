'use client'

import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react'

import {
	getHomeScroll,
	getStepScroll,
	setHomeScroll,
	setStepScroll,
} from './student-ui-state-storage'

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

export function useStepContentScroll(
	contentRef: RefObject<HTMLDivElement | null>,
	stepId: number,
) {
	useLayoutEffect(() => {
		const el = contentRef.current
		if (!el) return
		const saved = getStepScroll(stepId)
		if (saved > 0) el.scrollTop = saved
	}, [contentRef, stepId])

	useEffect(() => {
		const el = contentRef.current
		if (!el) return

		let raf = 0
		const onScroll = () => {
			cancelAnimationFrame(raf)
			raf = requestAnimationFrame(() => {
				setStepScroll(stepId, el.scrollTop)
			})
		}

		el.addEventListener('scroll', onScroll, { passive: true })
		return () => {
			cancelAnimationFrame(raf)
			el.removeEventListener('scroll', onScroll)
			setStepScroll(stepId, el.scrollTop)
		}
	}, [contentRef, stepId])
}

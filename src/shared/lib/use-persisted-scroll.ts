'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'

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

export function useStepWindowScroll(stepId: number) {
	useLayoutEffect(() => {
		const saved = getStepScroll(stepId)
		if (saved > 0) window.scrollTo(0, saved)
	}, [stepId])

	useEffect(() => {
		let raf = 0
		const onScroll = () => {
			cancelAnimationFrame(raf)
			raf = requestAnimationFrame(() => {
				setStepScroll(stepId, window.scrollY)
			})
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener('scroll', onScroll)
			setStepScroll(stepId, window.scrollY)
		}
	}, [stepId])
}

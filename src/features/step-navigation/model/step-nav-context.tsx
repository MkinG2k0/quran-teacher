'use client'

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react'

import { parseStepIdFromPath } from '../lib/parse-step-path'

const STEP_NAV_EVENT = 'quran-step-nav'

function readStepIdFromBrowser(): number | null {
	if (typeof window === 'undefined') return null
	return parseStepIdFromPath(window.location.pathname)
}

function notifyStepNavListeners(): void {
	window.dispatchEvent(new Event(STEP_NAV_EVENT))
}

interface StepNavContextValue {
	activeStepId: number | null
	openStep: (stepId: number) => void
	closeStep: () => void
}

const StepNavContext = createContext<StepNavContextValue | null>(null)

export function StepNavProvider({ children }: { children: ReactNode }) {
	const [activeStepId, setActiveStepId] = useState<number | null>(null)

	const syncFromBrowser = useCallback(() => {
		setActiveStepId(readStepIdFromBrowser())
	}, [])

	useEffect(() => {
		syncFromBrowser()
		window.addEventListener('popstate', syncFromBrowser)
		window.addEventListener(STEP_NAV_EVENT, syncFromBrowser)
		return () => {
			window.removeEventListener('popstate', syncFromBrowser)
			window.removeEventListener(STEP_NAV_EVENT, syncFromBrowser)
		}
	}, [syncFromBrowser])

	const openStep = useCallback((stepId: number) => {
		if (!Number.isInteger(stepId) || stepId <= 0) return
		window.history.pushState({ stepId }, '', `/step/${stepId}`)
		setActiveStepId(stepId)
		notifyStepNavListeners()
	}, [])

	const closeStep = useCallback(() => {
		window.history.pushState(null, '', '/')
		setActiveStepId(null)
		notifyStepNavListeners()
	}, [])

	const value = useMemo(
		() => ({ activeStepId, openStep, closeStep }),
		[activeStepId, openStep, closeStep],
	)

	return (
		<StepNavContext.Provider value={value}>{children}</StepNavContext.Provider>
	)
}

export function useStepNav(): StepNavContextValue {
	const ctx = useContext(StepNavContext)
	if (!ctx) {
		throw new Error('useStepNav must be used within StepNavProvider')
	}
	return ctx
}

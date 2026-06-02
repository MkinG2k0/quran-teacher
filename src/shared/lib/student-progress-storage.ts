import type { StepListItem } from '@/entities/step'

const STORAGE_KEY = 'quran-student-progress'

interface StudentProgress {
	completedStepIds: number[]
	updatedAt: string
}

function readProgress(): StudentProgress {
	if (typeof window === 'undefined') {
		return { completedStepIds: [], updatedAt: new Date(0).toISOString() }
	}

	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return { completedStepIds: [], updatedAt: new Date().toISOString() }
		const parsed = JSON.parse(raw) as StudentProgress
		if (!Array.isArray(parsed.completedStepIds)) {
			return { completedStepIds: [], updatedAt: new Date().toISOString() }
		}
		return {
			completedStepIds: parsed.completedStepIds.filter((id) => typeof id === 'number'),
			updatedAt: parsed.updatedAt ?? new Date().toISOString(),
		}
	} catch {
		return { completedStepIds: [], updatedAt: new Date().toISOString() }
	}
}

function writeProgress(data: StudentProgress) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getCompletedStepIds(): number[] {
	return readProgress().completedStepIds
}

export function isStepCompleted(stepId: number): boolean {
	return getCompletedStepIds().includes(stepId)
}

export function markStepComplete(stepId: number) {
	const current = readProgress()
	if (current.completedStepIds.includes(stepId)) return

	writeProgress({
		completedStepIds: [...current.completedStepIds, stepId],
		updatedAt: new Date().toISOString(),
	})
	notifyProgressUpdate()
}

export type StepMeta = Pick<StepListItem, 'id' | 'order' | 'title' | 'subtitle'>

interface ApplyProgressOptions {
	currentStepId?: number
	completedStepIds?: number[]
}

export function applyProgressToSteps(
	stepsRaw: StepMeta[],
	options: ApplyProgressOptions = {},
): StepListItem[] {
	const { currentStepId, completedStepIds = getCompletedStepIds() } = options
	const completedIds = new Set(completedStepIds)

	return stepsRaw.map((step) => {
		if (completedIds.has(step.id)) {
			return { ...step, status: 'completed' as const }
		}
		if (currentStepId === step.id) {
			return { ...step, status: 'current' as const }
		}
		return { ...step }
	})
}

export function subscribeProgress(onStoreChange: () => void) {
	const handler = (e: StorageEvent) => {
		if (e.key === STORAGE_KEY || e.key === null) onStoreChange()
	}
	window.addEventListener('storage', handler)
	window.addEventListener('quran-progress-update', onStoreChange)
	return () => {
		window.removeEventListener('storage', handler)
		window.removeEventListener('quran-progress-update', onStoreChange)
	}
}

export function notifyProgressUpdate() {
	window.dispatchEvent(new Event('quran-progress-update'))
}

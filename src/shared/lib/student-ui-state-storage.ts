const STORAGE_KEY = 'quran-student-ui-state'

interface StudentUiState {
	homePage: number | null
	homeScrollByPage: Record<string, number>
	stepScrollById: Record<string, number>
}

const EMPTY_STATE: StudentUiState = {
	homePage: null,
	homeScrollByPage: {},
	stepScrollById: {},
}

function readState(): StudentUiState {
	if (typeof window === 'undefined') return { ...EMPTY_STATE }

	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return { ...EMPTY_STATE }
		const parsed = JSON.parse(raw) as Partial<StudentUiState>
		return {
			homePage:
				typeof parsed.homePage === 'number' && parsed.homePage >= 1
					? parsed.homePage
					: null,
			homeScrollByPage:
				parsed.homeScrollByPage && typeof parsed.homeScrollByPage === 'object'
					? parsed.homeScrollByPage
					: {},
			stepScrollById:
				parsed.stepScrollById && typeof parsed.stepScrollById === 'object'
					? parsed.stepScrollById
					: {},
		}
	} catch {
		return { ...EMPTY_STATE }
	}
}

function writeState(state: StudentUiState) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getSavedHomePage(): number | null {
	return readState().homePage
}

export function setSavedHomePage(page: number) {
	const state = readState()
	writeState({ ...state, homePage: page })
}

export function getHomeScroll(page: number): number {
	const value = readState().homeScrollByPage[String(page)]
	return typeof value === 'number' && value >= 0 ? value : 0
}

export function setHomeScroll(page: number, scrollY: number) {
	const state = readState()
	writeState({
		...state,
		homeScrollByPage: {
			...state.homeScrollByPage,
			[String(page)]: Math.max(0, scrollY),
		},
	})
}

export function getStepScroll(stepId: number): number {
	const value = readState().stepScrollById[String(stepId)]
	return typeof value === 'number' && value >= 0 ? value : 0
}

export function setStepScroll(stepId: number, scrollTop: number) {
	const state = readState()
	writeState({
		...state,
		stepScrollById: {
			...state.stepScrollById,
			[String(stepId)]: Math.max(0, scrollTop),
		},
	})
}

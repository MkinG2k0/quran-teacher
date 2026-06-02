import type { StepMeta } from '@/shared/lib/student-progress-storage'

export interface StepsPageResponse {
	steps: StepMeta[]
	totalPublished: number
	page: number
	limit: number
	totalPages: number
}

export async function fetchStepsPage(
	page: number,
	limit: number,
): Promise<StepsPageResponse> {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	})
	const res = await fetch(`/api/steps?${params.toString()}`)
	if (!res.ok) throw new Error('Не удалось загрузить шаги программы')
	return res.json()
}

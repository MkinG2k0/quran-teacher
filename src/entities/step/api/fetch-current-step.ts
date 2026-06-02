import type { StepMeta } from '@/shared/lib/student-progress-storage'

export interface CurrentStepResponse {
	step: StepMeta | null
}

export async function fetchCurrentStep(
	excludeIds: number[],
): Promise<CurrentStepResponse> {
	const params = new URLSearchParams()
	if (excludeIds.length > 0) {
		params.set('exclude', excludeIds.join(','))
	}
	const query = params.toString()
	const res = await fetch(`/api/steps/current${query ? `?${query}` : ''}`)
	if (!res.ok) throw new Error('Не удалось загрузить текущий шаг')
	return res.json()
}

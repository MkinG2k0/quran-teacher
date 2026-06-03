export const STEPS_PER_SECTION = 50

/** Диапазон блока с перекрытием: 1–50, 50–100, 100–150 */
export function sectionDisplayRange(
	sectionIndex: number,
	sectionSize: number,
	totalPublished: number,
): { from: number; to: number } {
	const from = sectionIndex === 0 ? 1 : sectionIndex * sectionSize
	const to = Math.min((sectionIndex + 1) * sectionSize, totalPublished)
	return { from, to }
}

export function sectionPageBounds(
	page: number,
	sectionSize: number,
	totalPublished: number,
): { skip: number; take: number; fromOrder: number; toOrder: number } {
	const { from, to } = sectionDisplayRange(page - 1, sectionSize, totalPublished)
	return {
		fromOrder: from,
		toOrder: to,
		skip: from - 1,
		take: Math.max(0, to - from + 1),
	}
}

export function totalSectionPages(
	totalPublished: number,
	sectionSize: number = STEPS_PER_SECTION,
): number {
	if (totalPublished <= 0) return 1
	return Math.max(1, Math.floor((totalPublished - 1) / sectionSize) + 1)
}

/** Страница для шага на границе блока (50 → блок 50–100, не 1–50) */
export function sectionPageForOrder(
	order: number,
	sectionSize: number = STEPS_PER_SECTION,
): number {
	if (order <= 0) return 1
	if (order === 1) return 1
	const onBoundary = order % sectionSize === 0
	return Math.ceil((order - 1) / sectionSize) + (onBoundary ? 1 : 0)
}

export function formatSectionRange(
	sectionIndex: number,
	sectionSize: number,
	totalPublished: number,
): string {
	const { from, to } = sectionDisplayRange(
		sectionIndex,
		sectionSize,
		totalPublished,
	)
	return from === to ? `Шаг ${from}` : `Шаги ${from}–${to}`
}

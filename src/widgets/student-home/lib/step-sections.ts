export const STEPS_PER_SECTION = 50

export function chunkSteps<T>(items: T[], size = STEPS_PER_SECTION): T[][] {
	const chunks: T[][] = []
	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size))
	}
	return chunks
}

export function formatSectionRange(
	sectionIndex: number,
	sectionSize: number,
	countInSection: number,
): string {
	const from = sectionIndex * sectionSize + 1
	const to = from + countInSection - 1
	return from === to ? `Шаг ${from}` : `Шаги ${from}–${to}`
}

export function sectionIndexForOrder(order: number, sectionSize = STEPS_PER_SECTION): number {
	return Math.floor((order - 1) / sectionSize)
}

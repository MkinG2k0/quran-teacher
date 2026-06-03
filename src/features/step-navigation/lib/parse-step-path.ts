export function parseStepIdFromPath(pathname: string): number | null {
	const match = pathname.match(/^\/step\/(\d+)\/?$/)
	if (!match) return null
	const id = Number(match[1])
	return Number.isInteger(id) && id > 0 ? id : null
}

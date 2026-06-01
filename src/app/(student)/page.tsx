import { redirect } from 'next/navigation'

import type { StepListItem } from '@/entities/step'
import { auth } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'
import { StudentHome } from '@/widgets/student-home'

export default async function StudentHomePage() {
	const session = await auth()
	if (!session || session.user.role !== 'STUDENT') redirect('/login')

	const totalPublished = await prisma.step.count({ where: { isPublished: true } })

	const stepsRaw = await prisma.step.findMany({
		where: { isPublished: true },
		orderBy: { order: 'asc' },
		select: { id: true, order: true, title: true, subtitle: true },
	})

	const progress = await prisma.progress.findMany({
		where: { studentId: Number(session.user.id) },
		select: { stepId: true },
	})
	const completedIds = new Set(progress.map((p) => p.stepId))

	let foundCurrent = false
	const steps: StepListItem[] = stepsRaw.map((step) => {
		if (completedIds.has(step.id)) {
			return { ...step, status: 'completed' as const }
		}
		if (!foundCurrent) {
			foundCurrent = true
			return { ...step, status: 'current' as const }
		}
		return { ...step, status: 'locked' as const }
	})

	return (
		<StudentHome
			userName={session.user.name ?? 'Ученик'}
			steps={steps}
			totalPublished={totalPublished}
		/>
	)
}

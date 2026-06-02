import type { StepMeta } from '@/shared/lib/student-progress-storage'
import { prisma } from '@/shared/lib/prisma'
import { StudentHomeWithProgress } from '@/widgets/student-home'

export default async function StudentHomePage() {
	const totalPublished = await prisma.step.count({ where: { isPublished: true } })

	const stepsRaw = await prisma.step.findMany({
		where: { isPublished: true },
		orderBy: { order: 'asc' },
		select: { id: true, order: true, title: true, subtitle: true },
	})

	const stepsMeta: StepMeta[] = stepsRaw

	return (
		<StudentHomeWithProgress stepsMeta={stepsMeta} totalPublished={totalPublished} />
	)
}

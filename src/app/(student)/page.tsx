import { prisma } from '@/shared/lib/prisma'
import { StudentHomeWithProgress } from '@/widgets/student-home'

export default async function StudentHomePage() {
	const totalPublished = await prisma.step.count({ where: { isPublished: true } })

	return <StudentHomeWithProgress totalPublished={totalPublished} />
}

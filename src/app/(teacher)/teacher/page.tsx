import { redirect } from 'next/navigation'

import { auth } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'
import { TeacherStudents } from '@/widgets/teacher-students'

export default async function TeacherPage() {
	const session = await auth()
	if (!session || session.user.role !== 'TEACHER') redirect('/login')

	const totalPublished = await prisma.step.count({ where: { isPublished: true } })

	const students = await prisma.user.findMany({
		where: { teacherId: Number(session.user.id), role: 'STUDENT' },
		include: {
			progress: {
				include: { step: { select: { order: true } } },
				orderBy: { completedAt: 'desc' },
			},
		},
	})

	const now = Date.now()
	const result = students.map((s) => {
		const completed = s.progress.length
		const lastActivity = s.progress[0]?.completedAt ?? null
		const diffDays = lastActivity
			? (now - new Date(lastActivity).getTime()) / 86400000
			: 999
		const status =
			diffDays <= 1 ? ('active' as const) : diffDays <= 4 ? ('idle' as const) : ('lost' as const)
		const maxOrder = s.progress.reduce((max, p) => Math.max(max, p.step.order), 0)

		return {
			id: s.id,
			name: s.name,
			age: s.age,
			accessCode: s.accessCode,
			completedSteps: completed,
			currentStepOrder: maxOrder + 1,
			lastActivity: lastActivity?.toISOString() ?? null,
			status,
		}
	})

	return <TeacherStudents students={result} totalPublished={totalPublished} />
}

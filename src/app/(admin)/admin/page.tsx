import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/shared/lib/auth'
import { cn } from '@/shared/lib'
import { prisma } from '@/shared/lib/prisma'
import { Button } from '@/shared/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/ui/table'

import { AdminStepActions } from './admin-step-actions'
import { adminButtonPrimary } from './admin-ui'

export default async function AdminPage() {
	const session = await auth()
	if (!session || session.user.role !== 'SUPER_ADMIN') redirect('/login')

	const steps = await prisma.step.findMany({
		orderBy: { order: 'asc' },
		select: { id: true, order: true, title: true, isPublished: true },
	})

	return (
		<div className="font-body mx-auto max-w-4xl p-6">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<p className="text-xs uppercase tracking-widest text-[#4A4540]">Админ</p>
					<h1 className="font-display text-2xl font-semibold">Шаги программы</h1>
				</div>
				<Button
					render={<Link href="/admin/steps/new" />}
					type="button"
					variant="outline"
					className={cn(adminButtonPrimary)}
				>
					+ Новый шаг
				</Button>
			</div>

			<div className="overflow-hidden rounded-xl border border-[#222]">
				<Table>
					<TableHeader>
						<TableRow className="border-[#222] hover:bg-transparent">
							<TableHead className="text-[#6B6555]">№</TableHead>
							<TableHead className="text-[#6B6555]">Название</TableHead>
							<TableHead className="text-[#6B6555]">Опубликован</TableHead>
							<TableHead className="text-right text-[#6B6555]">Действия</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{steps.map((step) => (
							<TableRow key={step.id} className="border-[#222]">
								<TableCell>{step.order}</TableCell>
								<TableCell>{step.title}</TableCell>
								<TableCell>{step.isPublished ? 'Да' : 'Нет'}</TableCell>
								<TableCell className="text-right">
									<AdminStepActions stepId={step.id} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

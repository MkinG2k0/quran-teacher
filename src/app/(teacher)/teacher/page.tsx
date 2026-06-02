import { redirect } from 'next/navigation'

/** Teacher UI preserved in widgets; route blocked — see proxy.ts */
export default function TeacherPage() {
	redirect('/')
}

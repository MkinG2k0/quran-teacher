import { OfflineProgramProvider } from '@/features/offline-sync'

export default function StudentLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <OfflineProgramProvider>{children}</OfflineProgramProvider>
}

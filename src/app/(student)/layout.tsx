import { OfflineProgramProvider } from '@/features/offline-sync'
import { StepNavOverlay, StepNavProvider } from '@/features/step-navigation'

export default function StudentLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<OfflineProgramProvider>
			<StepNavProvider>
				{children}
				<StepNavOverlay />
			</StepNavProvider>
		</OfflineProgramProvider>
	)
}

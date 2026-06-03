import { FontSettingsProvider } from '@/features/font-settings'
import { OfflineProgramProvider } from '@/features/offline-sync'
import { StepNavOverlay, StepNavProvider } from '@/features/step-navigation'

export default function StudentLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<FontSettingsProvider>
			<OfflineProgramProvider>
				<StepNavProvider>
					{children}
					<StepNavOverlay />
				</StepNavProvider>
			</OfflineProgramProvider>
		</FontSettingsProvider>
	)
}

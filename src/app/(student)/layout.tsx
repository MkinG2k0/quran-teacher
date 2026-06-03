import { FontSettingsProvider } from '@/features/font-settings'
import { OfflineProgramProvider, PrefetchStudentRoutes } from '@/features/offline-sync'
import { StepNavOverlay, StepNavProvider } from '@/features/step-navigation'
import { ThemeSettingsProvider } from '@/features/theme-settings'

export default function StudentLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ThemeSettingsProvider>
			<FontSettingsProvider>
				<OfflineProgramProvider>
					<PrefetchStudentRoutes />
					<StepNavProvider>
						{children}
						<StepNavOverlay />
					</StepNavProvider>
				</OfflineProgramProvider>
			</FontSettingsProvider>
		</ThemeSettingsProvider>
	)
}

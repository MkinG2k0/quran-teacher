export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="dark min-h-screen bg-[#0D1117] text-[#E8E0D0]">
			{children}
		</div>
	)
}

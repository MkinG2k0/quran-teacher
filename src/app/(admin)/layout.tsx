export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen" style={{ background: '#0D1117', color: '#E8E0D0' }}>
			{children}
		</div>
	)
}

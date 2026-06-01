import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import type { UserRole } from '@/entities/user'

import { prisma } from './prisma'

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

export const { handlers, auth, signIn, signOut } = NextAuth({
	secret: authSecret,
	trustHost: true,
	session: { strategy: 'jwt' },
	pages: { signIn: '/login' },
	providers: [
		Credentials({
			id: 'credentials',
			name: 'Access Code',
			credentials: { code: { type: 'text' } },
			async authorize(credentials) {
				const code = (credentials?.code as string | undefined)?.trim()
				if (!code || code.length !== 6) return null

				const user = await prisma.user.findUnique({
					where: { accessCode: code },
				})
				if (!user) return null

				return {
					id: String(user.id),
					name: user.name,
					role: user.role as UserRole,
					teacherId: user.teacherId ?? null,
				}
			},
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.role = user.role
				token.teacherId = user.teacherId ?? null
			}
			return token
		},
		session({ session, token }) {
			session.user.id = token.id as string
			session.user.role = token.role as UserRole
			session.user.teacherId = (token.teacherId as number | null) ?? null
			return session
		},
	},
})

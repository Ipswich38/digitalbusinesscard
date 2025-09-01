import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import LinkedIn from "next-auth/providers/linkedin"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { NextAuthConfig } from "next-auth"

export const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // @ts-ignore - extending the session type
        session.user.plan = user.plan
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // @ts-ignore - extending the token type
        token.plan = user.plan
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/onboarding",
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
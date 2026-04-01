import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // High-Authority Role Assignment Logic
        token.role = user.email === 'adhiljoyappu@gmail.com' ? 'admin' : 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Enforce role in the session payload for frontend authority checks
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
})

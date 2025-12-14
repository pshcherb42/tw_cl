import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/lib/db"


export const authOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    session: async ({ token, session }: {token: any; session: any}) => {
      if (session?.user && token) {
        session.user.id = token.sub;
      }  
      return session;
    },
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

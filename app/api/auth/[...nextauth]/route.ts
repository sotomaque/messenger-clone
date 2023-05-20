import bcrypt from 'bcrypt';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import primsa from '@/app/libs/prismadb';

enum AuthErrors {
  InvalidCredentials = 'Invalid Credentials',
}

// TODO:
// cookies to store last successful auth method

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(primsa),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(AuthErrors.InvalidCredentials);
        }

        const user = await primsa.user.findUnique({
          where: { email: credentials.email },
        });

        // check if user exists
        if (!user || !user.hashedPassword) {
          throw new Error(AuthErrors.InvalidCredentials);
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error(AuthErrors.InvalidCredentials);
        }

        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// necessary for next-auth to work with nextjs api routes within the app directory
export { handler as GET, handler as POST };

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { getUserById } from '@/data/user';
import authConfig from '@/auth.config';
import { prisma } from '@/lib/prisma';
import { getTwoFactorConfirmationByUserId } from '@/data/TwoFactorConfirmation';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if(account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);
      if(!existingUser?.emailVerified) return false;

      if(existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if(!twoFactorConfirmation) return false;

        await prisma.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }

      return true;
    },
    async session({ token, session }) {
      if(token.sub && session.user) {
        session.user.id = token.sub;
      }

      if(token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },

    async jwt({ token }) {
      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if(!existingUser) return token;

      token.role = existingUser.role;

      return token;
    }
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  ...authConfig
});
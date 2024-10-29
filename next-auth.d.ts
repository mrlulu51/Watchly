import { UserRole } from "@prisma/client";
import NextAuth, { DefaultSession, JWT } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: UserRole;
  }
}
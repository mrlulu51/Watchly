"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { Mailer } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/TwoFactorToken";
import { getTwoFactorConfirmationByUserId } from "@/data/TwoFactorConfirmation";
import { prisma } from "@/lib/prisma";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  const mailer = new Mailer();

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    await mailer.sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Confirmation email sent again!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if(!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if(twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if(hasExpired) {
        return { error: "Code has expired!" };
      }

      await prisma.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if(existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await mailer.sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};

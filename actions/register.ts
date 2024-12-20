"use server";

import bcrypt from 'bcryptjs';
import * as z from 'zod';

import { prisma } from '@/lib/prisma';
import { RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { Mailer } from '@/lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  const mailer = new Mailer();

  if(!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 12);

  const existingUser = await getUserByEmail(email);
  if(existingUser) return { error: 'Email already in use!' }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await mailer.sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: "Confirmation email sent!"
  }
}
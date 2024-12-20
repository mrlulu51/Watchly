"use server";

import * as z from 'zod';

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from '@/lib/tokens';
import { Mailer } from '@/lib/mail';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validateFields = ResetSchema.safeParse(values);
  const mailer = new Mailer();

  if(!validateFields.success) {
    return { error: 'Invalid email!' };
  }

  const { email } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  if(!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await mailer.sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent!" };
}

import { Resend } from 'resend';
import { createTransport, Transporter } from 'nodemailer';

export class Mailer {
  private resend?: Resend;
  private nodemailer?: Transporter<any>;

  constructor() {
    if (process.env.MAIL_PROVIDER === 'resend') {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    } else if (process.env.MAIL_PROVIDER === 'nodemailer') {
      this.nodemailer = createTransport({
        host: process.env.NODEMAILER_HOST,
        port: parseInt(process.env.NODEMAILER_PORT ?? '465'),
        secure: JSON.parse(process.env.NODEMAILER_SECURE_SSL ?? "false"),
        requireTLS: JSON.parse(process.env.NODEMAILER_SECURE_TLS ?? "false"),
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD
        },
        tls: {
          rejectUnauthorized: JSON.parse(process.env.NODEMAILER_FORCE_CERT ?? "false"),
        }
      });

      this.nodemailer.verify((err) => {
        if (err) {
          console.error(err)
        }
      })
    }
  }

  public async sendVerificationEmail(email: string, token: string) {
    if (this.resend) {
      const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href=${confirmLink}>here</a> to confirm email.</p>`
      });
    } else if (this.nodemailer) {
      const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

      const message = {
        from: process.env.NODEMAILER_SENDER,
        to: email,
        subject: "Confirm you email",
        html: `<p>Click <a href=${confirmLink}>here</a> to confirm email.</p>`
      }

      this.nodemailer.sendMail(message);
    }
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    if (this.resend) {
      const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset password',
        html: `<p>Click <a href=${resetLink}>here</a> to reset your password.</p>`
      });
    } else if (this.nodemailer) {
      const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

      const message = {
        from: process.env.NODEMAILER_SENDER,
        to: email,
        subject: 'Reset password',
        html: `<p>Click <a href=${resetLink}>here</a> to reset your password.</p>`
      }

      this.nodemailer.sendMail(message);
    }
  }

  public async sendTwoFactorTokenEmail(email: string, token: string) {
    if (this.resend) {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Confirmation token',
        html: `<p>Here is your 2FA code: ${token}</p>`
      });
    } else if (this.nodemailer) {
      const message = {
        from: process.env.NODEMAILER_SENDER,
        to: email,
        subject: 'Reset password',
        html: `<p>Here is your 2FA code: ${token}</p>`
      }

      this.nodemailer.sendMail(message);
    }
  }
}
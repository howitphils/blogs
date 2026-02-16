import { createTransport } from "nodemailer";
import { appConfig } from "../../app-config";

export const emailService = {
  async sendRegistrationEmail(email: string, code: string) {
    const transport = emailService.createTransport();

    transport.sendMail({
      from: appConfig.NODEMAILER_SENDER_USERNAME,
      to: email,
      subject: "registration",
      html: `<h1>Thank for your registration</h1>
          <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
          </p>`,
    });
  },

  async sendPasswordRecoveryEmail(email: string, code: string) {
    const transport = emailService.createTransport();

    transport.sendMail({
      from: appConfig.NODEMAILER_SENDER_USERNAME,
      to: email,
      subject: "password recovery",
      html: `<h1>Password recovery</h1>
          <p>To recover your password please follow the link below:
            <a href='https://somesite.com/password-recovery?code=${code}'>recover password</a>
          </p>`,
    });
  },

  createTransport() {
    return createTransport({
      host: appConfig.NODEMAILER_HOST,
      auth: {
        user: appConfig.NODEMAILER_SENDER_USERNAME,
        pass: appConfig.NODEMAILER_SENDER_PASS,
      },
    });
  },
};

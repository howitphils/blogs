import nodemailer from "nodemailer";
import { appConfig } from "../../app-config";

const transporter = nodemailer.createTransport({
  host: appConfig.NODEMAILER_HOST,
  auth: {
    user: appConfig.NODEMAILER_SENDER_USERNAME,
    pass: appConfig.NODEMAILER_SENDER_PASS,
  },
});

export const emailService = {
  async sendRegistrationEmail(email: string, code: string) {
    try {
      transporter.sendMail({
        from: appConfig.NODEMAILER_SENDER_USERNAME,
        to: email,
        subject: "registration",
        html: `<h1>Thank for your registration</h1>
          <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
          </p>`,
      });
    } catch (error) {
      console.log("registration", error);
    }
  },
};

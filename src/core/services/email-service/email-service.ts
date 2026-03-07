import { createTransport } from "nodemailer";
import { appConfig } from "../../../app-config";
import { appSettings } from "../../../app-settings";
import { emailTemplates } from "./email-templates";
import { injectable } from "inversify";

@injectable()
export class EmailService {
  async sendEmail(email: string, subject: string, mailText: string) {
    const transport = createTransport({
      host: appConfig.NODEMAILER_HOST,
      auth: {
        user: appConfig.NODEMAILER_SENDER_USERNAME,
        pass: appConfig.NODEMAILER_SENDER_PASS,
      },
    });

    transport.sendMail({
      from: appConfig.NODEMAILER_SENDER_USERNAME,
      to: email,
      subject,
      html: mailText,
    });
  }

  async sendRegistrationEmail(email: string, code: string): Promise<void> {
    return this.sendEmail(
      email,
      appSettings.emailSubjects.registration,
      emailTemplates.getRegistrationTemplate(code),
    );
  }

  async sendPasswordRecoveryEmail(email: string, code: string): Promise<void> {
    return this.sendEmail(
      email,
      appSettings.emailSubjects.passwordRecovery,
      emailTemplates.getPasswordRecoveryTemplate(code),
    );
  }
}

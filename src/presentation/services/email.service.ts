import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs';


export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
}


export class EmailService {

  private transporter = nodemailer.createTransport( {
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    }
  });

  constructor() {}


  async sendEmail( options: SendMailOptions ): Promise<boolean> {
    const { to, subject, htmlBody, attachments: attachments = [] } = options;

    try {
      const sentInformation = await this.transporter.sendMail( {
        to,
        subject,
        html: htmlBody,
        attachments,
      });

      return true;
    } catch ( error ) {
      return false;
    }
  }
}
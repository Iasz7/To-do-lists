import nodemailer from 'nodemailer';
import { EmailService, SendMailOptions } from './email.service';

describe( 'EmailService', () => {
  const mockSendMail = jest.fn();

  // Mock al createTransport
  nodemailer.createTransport = jest.fn().mockReturnValue( {
    sendMail: mockSendMail
  });

  test( 'should send email', async () => {
    const options: SendMailOptions = {
      to: 'fernando@google.com',
      subject: 'Test',
      htmlBody: '<h1>Test</h1>'
    };
    const emailSevice = new EmailService();
    
    await emailSevice.sendEmail( options );

    expect( mockSendMail ).toHaveBeenCalledWith( {
      attachments: expect.any( Array ),
      html: "<h1>Test</h1>",
      subject: "Test",
      to: "fernando@google.com",
    } );
  } );
} );
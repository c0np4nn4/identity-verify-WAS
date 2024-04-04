import { MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigService } from '@nestjs/config';

const configService: ConfigService = new ConfigService();

export const mailerConfig: MailerOptions = {
  //transport: 'smtps://evstpu@gmail.com:uqgbfpvhtrdtoizv@smtp.gmail.com',
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'jinjae781@gmail.com',
      // TODO: launch.env에도 추가 필요
      pass: configService.get<string>('MAIL_PASSWORD'),
    },
  },
  defaults: {
    from: `"no-reply" <hello@gmail.com>`,
  },
  preview: true,
  template: {
    dir: __dirname,
    adapter: new EjsAdapter(),
  },
};

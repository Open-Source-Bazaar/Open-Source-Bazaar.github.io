import { createKoaRouter, withKoaRouter } from 'next-ssr-middleware';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import {
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_USER,
} from '../../../../../models/configuration';
import { safeAPI, verifyJWT } from '../../../core';

export const config = { api: { bodyParser: false } };

const router = createKoaRouter(import.meta.url),
  transporter = createTransport({
    host: SMTP_HOST,
    port: +SMTP_PORT,
    secure: +SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

router.post('/bot/message', safeAPI, verifyJWT, async context => {
  const input = Reflect.get(context.request, 'body') as Mail.Options;

  context.body = await transporter.sendMail({ ...input, from: SMTP_USER });
});

export default withKoaRouter(router);

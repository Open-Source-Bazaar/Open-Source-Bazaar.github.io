import { NextRequest } from 'next/server';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import {
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_USER,
} from '../../../../../../models/configuration';
import { safeRoute, verifyJWT } from '../../../../../../lib/api/route-helper';

const transporter = createTransport({
  host: SMTP_HOST,
  port: +SMTP_PORT,
  secure: +SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
});

export const POST = safeRoute(async (request: NextRequest) => {
  verifyJWT(request);

  const input = (await request.json()) as Mail.Options;

  return Response.json(await transporter.sendMail({ ...input, from: SMTP_USER }));
});

#!/usr/bin/env node
/**
 * Test SMTP connection using backend .env credentials.
 * Run: node scripts/test-smtp.js [recipient@example.com]
 * Use SMTP_PORT=2525 to try alternate port if 587 fails.
 */
'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const nodemailer = require('nodemailer');

const to = process.argv[2] || process.env.SMTP_USERNAME || 'test@example.com';
const host = process.env.SMTP_HOST || 'smtp.mailersend.net';
const port = parseInt(process.env.SMTP_PORT || '587', 10);
const user = (process.env.SMTP_USERNAME || '').trim();
const pass = (process.env.SMTP_PASSWORD || '').trim();
const from = (process.env.MAILER_FROM || 'noreply@aiseen.co').trim();

// Trim helps avoid copy-paste issues; show length to detect truncation
const userLen = user.length;
const passLen = pass.length;

if (!user || !pass) {
  console.error('Missing SMTP_USERNAME or SMTP_PASSWORD in .env');
  process.exit(1);
}

console.log('Using:', {
  host,
  port,
  user: user.slice(0, 15) + '***',
  userLength: userLen,
  passLength: passLen,
});
if (userLen < 10 || passLen < 20) {
  console.warn('Warning: Username or password looks short. MailerSend passwords are usually ~50 chars.');
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false,
  requireTLS: true,
  auth: { user, pass },
  tls: { rejectUnauthorized: true },
});

async function main() {
  try {
    await transporter.verify();
    console.log('SMTP connection OK');
  } catch (err) {
    console.error('SMTP verify failed:', err.message);
    if (port === 587) {
      console.log('\nTry port 2525: SMTP_PORT=2525 npm run test:smtp');
    }
    process.exit(1);
  }
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Strapi SMTP test',
      text: 'If you see this, SMTP is working.',
    });
    console.log('Email sent:', info.messageId);
  } catch (err) {
    console.error('Send failed:', err.message);
    if (err.response) console.error('Server response:', err.response);
    process.exit(1);
  }
}

main();

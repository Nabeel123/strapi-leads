#!/usr/bin/env node
/**
 * Test SMTP connection using backend .env credentials.
 * Run: node scripts/test-smtp.js [recipient@example.com]
 * Helps verify nodemailer/MailerSend config before debugging Strapi.
 */
'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const nodemailer = require('nodemailer');

const to = process.argv[2] || process.env.SMTP_USERNAME || 'test@example.com';
const host = process.env.SMTP_HOST || 'smtp.mailersend.net';
const port = parseInt(process.env.SMTP_PORT || '587', 10);
const user = process.env.SMTP_USERNAME;
const pass = process.env.SMTP_PASSWORD;
const from = process.env.MAILER_FROM || 'noreply@aiseen.co';

if (!user || !pass) {
  console.error('Missing SMTP_USERNAME or SMTP_PASSWORD in .env');
  process.exit(1);
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
  console.log('Testing SMTP...', { host, port, user: user?.slice(0, 10) + '***' });
  try {
    await transporter.verify();
    console.log('SMTP connection OK');
  } catch (err) {
    console.error('SMTP verify failed:', err.message);
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

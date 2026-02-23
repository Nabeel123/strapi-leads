#!/usr/bin/env node
/**
 * Test MailerSend API (not SMTP) using backend .env.
 * Run: node scripts/test-mailersend-api.js [recipient@example.com]
 * Requires MAILERSEND_API_KEY in .env (from MailerSend → Settings → API Tokens)
 */
'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const apiKey = (process.env.MAILERSEND_API_KEY || '').trim();
// Use blackhole for testing if no recipient given (MailerSend accepts these without recipient restrictions)
const to = process.argv[2] || 'hard-bounce@bounce-test.mailersend.net';
const from = (process.env.MAILER_FROM || 'noreply@aiseen.co').trim();

if (!apiKey) {
  console.error('Missing MAILERSEND_API_KEY in .env');
  console.error('Get it from: MailerSend Dashboard → Settings → API Tokens → Create token');
  process.exit(1);
}

async function main() {
  const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
  const mailerSend = new MailerSend({ apiKey });

  const sentFrom = new Sender(from, 'AISEEN');
  const recipients = [new Recipient(to, '')];
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject('Strapi MailerSend API test')
    .setText('If you see this, the MailerSend API is working.')
    .setHtml('<p>If you see this, the MailerSend API is working.</p>');

  try {
    const res = await mailerSend.email.send(emailParams);
    const msgId = res?.headers?.['x-message-id'] || res?.headers?.['X-Message-Id'];
    console.log('Email sent:', msgId || `status ${res?.statusCode}`);
  } catch (err) {
    const msg = err.body?.message || err.body?.errors?.[0]?.message || err.message;
    const status = err.statusCode || err.status;
    console.error('Send failed:', msg || '(no message)');
    if (status) console.error('Status:', status);
    if (err.body) console.error('Response:', JSON.stringify(err.body, null, 2));
    if (!msg && !err.body) console.error('Error:', err);
    process.exit(1);
  }
}

main();

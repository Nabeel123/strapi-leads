'use strict';

const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

module.exports = {
  provider: 'mailersend',
  name: 'MailerSend',
  init(providerOptions, settings) {
    const apiKey = providerOptions.apiKey;
    if (!apiKey) {
      throw new Error('MailerSend provider requires apiKey in providerOptions');
    }

    const mailerSend = new MailerSend({ apiKey });

    return {
      send(options) {
        const from = options.from || settings.defaultFrom;
        const fromStr = typeof from === 'string' ? from : from?.address || from?.email || settings.defaultFrom;
        const fromName = typeof from === 'object' && from?.name ? from.name : 'AISEEN';

        let toList = options.to;
        if (typeof toList === 'string') {
          toList = toList.split(',').map((e) => e.trim()).filter(Boolean);
        }
        if (!Array.isArray(toList)) {
          toList = [toList];
        }

        const recipients = toList.map((item) => {
          if (typeof item === 'string') {
            return new Recipient(item, '');
          }
          return new Recipient(item.email || item.address, item.name || '');
        });

        const sentFrom = new Sender(fromStr, fromName);
        const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setTo(recipients)
          .setSubject(options.subject || '')
          .setText(options.text || options.html || '')
          .setHtml(options.html || options.text || '');

        if (options.replyTo) {
          const rt = typeof options.replyTo === 'string' ? options.replyTo : options.replyTo.email || options.replyTo.address;
          emailParams.setReplyTo(new Recipient(rt, ''));
        }

        return mailerSend.email.send(emailParams);
      },
    };
  },
};

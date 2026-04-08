require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const {
  SUPPORT_EMAIL,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM,
  SUPPORT_WHATSAPP_TO
} = process.env;

function buildWhatsAppUrl(to, text) {
  const phone = String(to).replace(/[^0-9]/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/contact', async (req, res) => {
  const { name, phone, email, service, message } = req.body;

  if (!name || !phone || !email || !service || !message) {
    return res.status(400).json({ ok: false, error: 'All fields are required.' });
  }

  let emailSent = false;
  let whatsappSent = false;
  let whatsappUrl = null;
  const formattedBody = `New request from ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`;

  if (SUPPORT_EMAIL && SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: SMTP_SECURE === 'true',
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `Machete IT Solution <${SMTP_USER}>`,
        to: SUPPORT_EMAIL,
        replyTo: email,
        subject: 'New Machete IT Support Request',
        text: formattedBody
      });

      emailSent = true;
    } catch (error) {
      console.error('Email send failed:', error);
    }
  }

  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_WHATSAPP_FROM && SUPPORT_WHATSAPP_TO) {
    try {
      const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      await client.messages.create({
        from: TWILIO_WHATSAPP_FROM,
        to: SUPPORT_WHATSAPP_TO,
        body: formattedBody
      });

      whatsappSent = true;
    } catch (error) {
      console.error('WhatsApp send failed:', error);
    }
  } else if (SUPPORT_WHATSAPP_TO) {
    whatsappUrl = buildWhatsAppUrl(SUPPORT_WHATSAPP_TO, formattedBody);
  }

  return res.json({
    ok: true,
    emailSent,
    whatsappSent,
    whatsappUrl
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

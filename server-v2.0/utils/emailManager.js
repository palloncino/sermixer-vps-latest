import dotenv from "dotenv";
import formData from "form-data";
import Mailgun from "mailgun.js";

// Load environment variables
const envPath = process.env.NODE_ENV === "production" ? ".env.remote" : ".env.local";
dotenv.config({ path: envPath });

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.EMAIL_SERVICE_API_KEY,
  url: 'https://api.mailgun.net', // Directly use US endpoint
});

const DOMAIN = process.env.EMAIL_SERVICE_DOMAIN;

// Utility function to send an email
const sendEmail = async (to, subject, text, html) => {
  try {
    const msg = {
      from: process.env.EMAIL_SERVICE_USER,
      to,
      subject,
      text,
      html,
    };

    console.log("Sending email with:", msg, DOMAIN, process.env.EMAIL_SERVICE_API_KEY);

    const response = await mg.messages.create(DOMAIN, msg);
    console.log("Email sent successfully:", response);
    return { success: true };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { success: false, error: "Error sending email" };
  }
};

// Example function to send a document creation email
export const sendDocumentCreatedEmail = async (emailReceiver, clientName, hash, otp) => {
  const subject = "Il tuo documento è stato creato";
  const text = `Gentile ${clientName},\n\nIl tuo documento è stato creato. Trova i dettagli di seguito:\n\nHash: ${hash}\nOTP: ${otp}\n\nCordiali saluti,\nIl tuo team`;
  const html = `<p>Gentile ${clientName},</p><p>Il tuo documento è stato creato. Trova i dettagli di seguito:</p><p><strong>Hash:</strong> ${hash}</p><p><strong>OTP:</strong> ${otp}</p><p>Cordiali saluti,</p><p>Il tuo team</p>`;

  return await sendEmail(emailReceiver, subject, text, html);
};  

export const sendFollowupDocumentEmail = async (emailReceiver, clientName) => {
  const subject = "Promemoria: Azione richiesta";
  const text = `Gentile ${clientName},\n\nTi ricordiamo di rivedere il tuo documento.\n\nCordiali saluti,\nIl tuo team`;
  const html = `<p>Gentile ${clientName},</p><p>Ti ricordiamo di rivedere il tuo documento.</p><p>Cordiali saluti,</p><p>Il tuo team</p>`;
  return await sendEmail(emailReceiver, subject, text, html);
};

export const sendExpiredDocumentEmail = async (emailReceiver, clientName) => {
  const subject = "Avviso di scadenza";
  const text = `Gentile ${clientName},\n\nIl tuo documento sta per scadere.\n\nCordiali saluti,\nIl tuo team`;
  const html = `<p>Gentile ${clientName},</p><p>Il tuo documento sta per scadere.</p><p>Cordiali saluti,</p><p>Il tuo team</p>`;
  return await sendEmail(emailReceiver, subject, text, html);
};

export const sendClosedDocumentEmail = async (emailReceiver, clientName) => {
  const subject = "Il tuo documento è stato chiuso";
  const text = `Gentile ${clientName},\n\nIl tuo documento è stato chiuso. Se hai domande, non esitare a contattarci.\n\nCordiali saluti,\nIl tuo team`;
  const html = `<p>Gentile ${clientName},</p><p>Il tuo documento è stato chiuso. Se hai domande, non esitare a contattarci.</p><p>Cordiali saluti,</p><p>Il tuo team</p>`;

  return await sendEmail(emailReceiver, subject, text, html);
};

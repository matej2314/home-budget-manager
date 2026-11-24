import nodemailer from 'nodemailer';

/** @type {import('nodemailer').Transporter | null | undefined} */
let transporter;

/**
 * Lazy singleton SMTP. Brak host/user/password → null (K-13: produkt bez skrzynki).
 * Nie logować SMTP_PASSWORD / pełnego auth (B-15).
 */
export function getMailTransporter() {
  if (transporter !== undefined) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    transporter = null;
    return transporter;
  }

  const parsed = Number(process.env.SMTP_PORT || 587);
  const port = Number.isFinite(parsed) ? parsed : 587;
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

/** Reset lazy cache — wyłącznie pod Jest. */
export function resetMailTransporterForTests() {
  transporter = undefined;
}

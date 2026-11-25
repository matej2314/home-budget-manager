import logger from '../../configs/logger.js';
import { getMailTransporter } from '../../configs/mailTransport.js';
import { findUserById } from '../../database/users.js';
import { findHouseholdById } from '../../database/households.js';
import { renderInvitationEmail } from './invitationEmailTemplates.js';

/**
 * Skutek uboczny zaproszenia (K-14). Nigdy nie rzuca — awaria SMTP ≠ rollback (K-13).
 * @param {{
 *   recipientUserId: string,
 *   houseId: string,
 *   invitingUserName: string,
 *   templateId: string,
 *   decision?: 'accepted' | 'rejected',
 * }} params
 */
export async function sendInvitationEmail({
  recipientUserId,
  houseId,
  invitingUserName,
  templateId,
  decision,
}) {
  try {
    const transporter = getMailTransporter();
    if (!transporter) {
      logger.info('SMTP not configured; invitation email skipped');
      return { sent: false, reason: 'smtp_unconfigured', templateId };
    }

    const user = await findUserById(recipientUserId);
    const house = await findHouseholdById(houseId);
    if (!user?.email || !house?.houseName) {
      logger.warn(
        'invitation email skipped: missing recipient email or house name',
      );
      return { sent: false, reason: 'missing_data', templateId };
    }

    const appUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;
    const { subject, text, html } = renderInvitationEmail({
      templateId,
      houseName: house.houseName,
      invitingUserName,
      appUrl,
      decision,
    });

    await transporter.sendMail({
      from,
      to: user.email,
      subject,
      text,
      html,
    });

    return { sent: true, templateId };
  } catch (error) {
    logger.error(`invitation email failed: ${error?.message || error}`);
    return { sent: false, reason: 'send_failed', templateId };
  }
}

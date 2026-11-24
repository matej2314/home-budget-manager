import logger from "../../configs/logger.js";
import { getMailTransporter } from "../../configs/mailTransport.js";
import { findUserById } from "../../database/users.js";
import { findHouseholdById } from "../../database/households.js";

/**
 * Skutek uboczny zaproszenia (K-14). Nigdy nie rzuca — awaria SMTP ≠ rollback (K-13).
 * @param {{ invitedUserId: string, houseId: string, invitingUserName: string, kind: 'host_added' | 'inmate_pending' }} params
 */
export async function sendInvitationEmail({
  invitedUserId,
  houseId,
  invitingUserName,
  kind,
}) {
  try {
    const transporter = getMailTransporter();
    if (!transporter) {
      logger.info("SMTP not configured; invitation email skipped");
      return { sent: false, reason: "smtp_unconfigured" };
    }

    const user = await findUserById(invitedUserId);
    const house = await findHouseholdById(houseId);
    if (!user?.email || !house?.houseName) {
      logger.warn(
        "invitation email skipped: missing recipient email or house name",
      );
      return { sent: false, reason: "missing_data" };
    }

    const appUrl = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;
    const houseName = house.houseName;
    const isPending = kind === "inmate_pending";

    const subject = isPending
      ? `Invitation to household "${houseName}"`
      : `You joined household "${houseName}"`;

    const text = isPending
      ? [
          `${invitingUserName} invited you to the household "${houseName}".`,
          `Log in at ${appUrl}. The household host must accept the invitation before you join.`,
        ].join("\n")
      : [
          `You were added to the household "${houseName}" by ${invitingUserName}.`,
          `Log in at ${appUrl} to continue.`,
        ].join("\n");

    const escaped = (string) =>
      String(string)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const html = `<p>${escaped(text).replace(/\n/g, "<br />")}</p>`;

    await transporter.sendMail({
      from,
      to: user.email,
      subject,
      text,
      html,
    });

    return { sent: true };
  } catch (error) {
    logger.error(`invitation email failed: ${error?.message || error}`);
    return { sent: false, reason: "send_failed" };
  }
}

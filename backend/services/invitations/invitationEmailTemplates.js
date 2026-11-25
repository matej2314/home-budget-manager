/** Stałe ID szablonów (K-14 / docs). */
export const InvitationEmailTemplateId = {
  CAND_HOST_ADDED: 'T-cand-host-added',
  CAND_INMATE_PENDING: 'T-cand-inmate-pending',
  HOST_INMATE_PENDING: 'T-host-inmate-pending',
  CAND_DECISION: 'T-cand-decision',
};

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toHtml(text) {
  return `<p>${escapeHtml(text).replace(/\n/g, '<br />')}</p>`;
}

/**
 * @param {{
 *   templateId: string,
 *   houseName: string,
 *   invitingUserName: string,
 *   appUrl: string,
 *   decision?: 'accepted' | 'rejected',
 * }} params
 * @returns {{ subject: string, text: string, html: string }}
 */
export function renderInvitationEmail({
  templateId,
  houseName,
  invitingUserName,
  appUrl,
  decision,
}) {
  switch (templateId) {
    case InvitationEmailTemplateId.CAND_HOST_ADDED: {
      const text = [
        `You were added to the household "${houseName}" by ${invitingUserName}.`,
        `Log in at ${appUrl} to continue.`,
      ].join('\n');
      return {
        subject: `[T-cand-host-added] You joined household "${houseName}"`,
        text,
        html: toHtml(text),
      };
    }
    case InvitationEmailTemplateId.CAND_INMATE_PENDING: {
      const text = [
        `${invitingUserName} invited you to the household "${houseName}".`,
        `Log in at ${appUrl}. The household host must accept the invitation before you join.`,
      ].join('\n');
      return {
        subject: `[T-cand-inmate-pending] Invitation to household "${houseName}"`,
        text,
        html: toHtml(text),
      };
    }
    case InvitationEmailTemplateId.HOST_INMATE_PENDING: {
      const text = [
        `${invitingUserName} proposed a new member for household "${houseName}".`,
        `Review pending invitations at ${appUrl}.`,
      ].join('\n');
      return {
        subject: `[T-host-inmate-pending] Pending invitation in "${houseName}"`,
        text,
        html: toHtml(text),
      };
    }
    case InvitationEmailTemplateId.CAND_DECISION: {
      const accepted = decision === 'accepted';
      const text = accepted
        ? [
            `Your invitation to household "${houseName}" was accepted.`,
            `Log in at ${appUrl} to continue.`,
          ].join('\n')
        : [
            `Your invitation to household "${houseName}" was declined.`,
            `Log in at ${appUrl} for other options.`,
          ].join('\n');
      return {
        subject: accepted
          ? `[T-cand-decision] Accepted — "${houseName}"`
          : `[T-cand-decision] Declined — "${houseName}"`,
        text,
        html: toHtml(text),
      };
    }
    default:
      throw new Error(`Unknown invitation email template: ${templateId}`);
  }
}

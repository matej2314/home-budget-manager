import { describe, expect, test } from '@jest/globals';
import {
  InvitationEmailTemplateId,
  renderInvitationEmail,
} from '../../services/invitations/invitationEmailTemplates.js';

describe('invitationEmailTemplates (K-14)', () => {
  const base = {
    houseName: 'Dom <A&B>',
    invitingUserName: 'alice<script>',
    appUrl: 'https://app.test.local',
  };

  test('cztery ID dają rozróżnialne subject + escapowany html', () => {
    const ids = Object.values(InvitationEmailTemplateId);
    const subjects = ids.map((templateId) => {
      const rendered = renderInvitationEmail({
        ...base,
        templateId,
        decision:
          templateId === InvitationEmailTemplateId.CAND_DECISION
            ? 'accepted'
            : undefined,
      });
      expect(rendered.subject).toContain(`[${templateId}]`);
      expect(rendered.html).toContain('Dom &lt;A&amp;B&gt;');
      expect(rendered.html).not.toContain('<script>');
      return rendered.subject;
    });
    expect(new Set(subjects).size).toBe(ids.length);
  });

  test('T-cand-decision rejected ≠ accepted w subject/text', () => {
    const ok = renderInvitationEmail({
      ...base,
      templateId: InvitationEmailTemplateId.CAND_DECISION,
      decision: 'accepted',
    });
    const no = renderInvitationEmail({
      ...base,
      templateId: InvitationEmailTemplateId.CAND_DECISION,
      decision: 'rejected',
    });
    expect(ok.subject).toMatch(/Accepted/i);
    expect(no.subject).toMatch(/Declined/i);
    expect(ok.text).not.toEqual(no.text);
  });
});

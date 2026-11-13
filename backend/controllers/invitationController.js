import { runController } from '../utils/http/runController.js';
import { acceptInvitation } from '../services/invitations/acceptInvitation.js';
import { rejectInvitation } from '../services/invitations/rejectInvitation.js';
import { getInvitationsCollection } from '../services/invitations/getInvitationsCollection.js';

export async function acceptInvitationHandler(req, res) {
  return runController(res, () =>
    acceptInvitation({
      invitationId: req.body.invitationId,
      invitedUserId: req.body.invitedUserId,
      hostId: req.userId,
    }),
  );
}

export async function rejectInvitationHandler(req, res) {
  return runController(res, () =>
    rejectInvitation({
      invitationId: req.body.invitationId,
      hostId: req.userId,
    }),
  );
}

export async function getInvitationsCollectionHandler(req, res) {
  return runController(res, () => getInvitationsCollection());
}

export {
  acceptInvitationHandler as acceptInvitation,
  rejectInvitationHandler as rejectInvitation,
  getInvitationsCollectionHandler as getInvitationsCollection,
};

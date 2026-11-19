import { Router } from 'express';

const router = Router();

/** Liveness procesu — bez auth, bez sekretów (B-16 / S-18). */
router.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;

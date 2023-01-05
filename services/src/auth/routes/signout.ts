import { Router, Request, Response } from 'express';

const router = Router();

router.post('/api/users/signout', (req, res) => {
  req.session = null;
  // TODO: push to event bus
  res.send({});
});

export { router as signOutRouter };

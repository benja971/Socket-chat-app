import { Router } from 'express';
import { getMessagesSchema } from '../schemas/message.schema';
import { getMessagesHandler } from '../controllers/message.controller';
import validateResource from '../middlewares/validateResources';

const router = Router();

router.get('/:discussionId', validateResource(getMessagesSchema), getMessagesHandler);

export default router;

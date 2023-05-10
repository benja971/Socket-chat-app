import { Router } from 'express';
import {
	addUsersToDiscussionHandler,
	createDiscussionHandler,
	findDiscussionByIdHandler,
	findDiscussionByTitleHandler,
	listDiscussionHandler,
	listDiscussionUsersHandler,
} from '../controllers/discussion.controller';
import validateRequest from '../middlewares/validateResources';
import {
	AddUserToDiscussionSchema,
	CreateDiscussionSchema,
	FindDiscussionByTitleSchema,
	FindDiscussionSchema,
	ListDiscussionMembersSchema,
	ListDiscussionSchema,
} from '../schemas/discussion.schema';

const router = Router();

router.post('/:ownerId', validateRequest(CreateDiscussionSchema), createDiscussionHandler);

router.get('/:ownerId', validateRequest(ListDiscussionSchema), listDiscussionHandler);

router.get('/find-by-id/:ownerId/:discussionId', validateRequest(FindDiscussionSchema), findDiscussionByIdHandler);

router.get('/:discussionId/members', validateRequest(ListDiscussionMembersSchema), listDiscussionUsersHandler);

router.get('/find-by-title/:type/:title', validateRequest(FindDiscussionByTitleSchema), findDiscussionByTitleHandler);

router.put('/:discussionId/members/:senderId/:userId', validateRequest(AddUserToDiscussionSchema), addUsersToDiscussionHandler);

export default router;

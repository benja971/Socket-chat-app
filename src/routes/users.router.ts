import { Router } from 'express';
import validateResource from '../middlewares/validateResources';
import { createUserHandler, findUserByIdHandler, findUserByUsername, getUsersHandler } from '../controllers/user.controller';
import { FindUserByIdSchema, createUserSchema, getUserSchema, getUsersSchema } from '../schemas/user.schema';

const router = Router();

router.post('/', validateResource(createUserSchema), createUserHandler);

router.get('/:userId', validateResource(getUsersSchema), getUsersHandler);

router.get('/user/:userId', validateResource(FindUserByIdSchema), findUserByIdHandler);

export default router;

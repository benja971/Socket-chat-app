import express, { Router } from 'express';
import { join } from 'path';
import discussionRouter from './discussions.router';
import messageRouter from './messages.router';
import userRouter from './users.router';
import log from '../utils/logger';

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/', express.static(join(__dirname, '..', '..', 'public')));

router.use((req, _, next) => {
	log.debug(`${req.method} ${req.path}`);
	next();
});

router.use('/api/v1', router);

router.use('/users', userRouter);
router.use('/discussions', discussionRouter);
router.use('/messages', messageRouter);

router.get('*.css', (req, res) => {
	res.sendFile(join(__dirname, '..', '..', 'public', 'styles', 'css', req.path));
});

router.get('*.js', (req, res) => {
	if (req.path === '/socket.io.js') {
		const path = join(__dirname, '..', '..', 'node_modules', 'socket.io', 'client-dist', 'socket.io.js');
		res.sendFile(path);
		return;
	}
	res.sendFile(join(__dirname, '..', '..', 'public', 'scripts', req.path));
});

export default router;

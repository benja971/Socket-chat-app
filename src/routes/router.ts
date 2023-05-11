import express, { Router } from 'express';
import discussionRouter from './discussions.router';
import messageRouter from './messages.router';
import userRouter from './users.router';

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/', express.static("./public/"));

router.use((req, _, next) => {
	console.log(`${req.method} ${req.path}`);
	next();
});

router.use('/api/v1', router);

router.use('/users', userRouter);
router.use('/discussions', discussionRouter);
router.use('/messages', messageRouter);


router.get("/socket.io.js", (_, res) => {
	const path = "/root/socket-chat-app/node_modules/socket.io/client-dist/socket.io.js";
	res.sendFile(path);
});

export default router;

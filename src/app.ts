process.stdout.write('\x1Bc');

require('dotenv').config();
import config from 'config';
import express from 'express';
import { createServer } from 'http';
import log from './utils/logger';
import { Server } from 'socket.io';

import router from './routes/router';

const app = express();
const server = createServer(app);

app.use('/', router);

const port = config.get<number>('PORT');
server.listen(port, () => {
	log.info(`Server is listening on port ${port}`);
});

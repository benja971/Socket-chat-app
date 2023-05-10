import logger from 'pino';
import dayjs from 'dayjs';
import config from 'config';

const log = logger({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			ignore: 'pid,hostname',
		},
	},
	base: {
		pid: false,
	},
	timestamp: () => `,"time":"${dayjs().format()}"`,
	level: config.get<string>('LOG_LEVEL'),
});

export default log;

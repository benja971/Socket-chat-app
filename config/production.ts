const dev_mode = process.env.NODE_ENV !== 'production';

const config = {
	PORT: process.env.PORT || 8080,
	DEV_MODE: dev_mode,
	LOG_LEVEL: dev_mode ? 'debug' : 'info',
	DB_DATABASE: process.env.DB_NAME || 'database',
	DB_USER: process.env.DB_USER || 'root',
	DB_PASS: process.env.DB_PASS || 'password',
	DB_HOST: dev_mode ? 'localhost' : process.env.DB_HOST || 'localhost',
	DB_PORT: process.env.DB_PORT || 3306,
};

export default config;

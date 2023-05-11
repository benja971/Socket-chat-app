const dev_mode = false

const config = {
	PORT: process.env.PORT,
	DEV_MODE: dev_mode,
	LOG_LEVEL: 'info',
	DB_DATABASE: process.env.DB_NAME,
	DB_USER: process.env.DB_USER,
	DB_PASS: process.env.DB_PASS,
	DB_HOST: 'localhost',
	DB_PORT: process.env.DB_PORT,
};

export default config;

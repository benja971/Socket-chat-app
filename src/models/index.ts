import log from '../utils/logger';
import { sequelize, models } from './database';

function initDb() {
	sequelize
		.authenticate()
		.then(() => {
			log.info('Connection has been established successfully.');
		})
		.catch(err => {
			log.error('Unable to connect to the database:', err);
			process.exit(1);
		});

	sequelize
		.sync({ force: true, alter: true })
		.then(() => {
			Object.keys(models).forEach(modelName => {
				log.debug(`Initializing scopes for ${modelName}...`);
				if (models[modelName].initScopes) {
					models[modelName].initScopes();
				}
			});

			log.info('Database synced successfully.');
		})
		.catch((err: Error) => {
			console.error(err);
			log.error('Unable to sync database.', err);
			process.exit(1);
		});
}

initDb();

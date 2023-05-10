import { Sequelize } from 'sequelize';
import { join } from 'node:path';
import config from 'config';
import log from '../utils/logger';
import { readdirSync } from 'node:fs';

log.debug('Initializing database...');

const sequelize = new Sequelize(config.get('DB_DATABASE'), config.get('DB_USER'), config.get('DB_PASS'), {
	host: config.get('DB_HOST'),
	port: config.get<number>('DB_PORT'),
	dialect: 'mysql',
	logging: false,
	define: {
		timestamps: true,
	},
	pool: {
		acquire: 30000,
		max: 5,
		min: 0,
		idle: 10000,
	},
});

const models: { [key: string]: any } = {};

const devMode = config.get<boolean>('DEV_MODE');

// every file with a *model.ts or *model.js extension will be imported
const modelFiles = readdirSync(__dirname).filter(file => {
	return file.includes('.model.') && (devMode ? file.endsWith('.ts') : file.endsWith('.js'));
});

log.debug(`Found ${modelFiles.length} models.`);

modelFiles.forEach(file => {
	const model = require(join(__dirname, file)).default;
	log.debug(`Importing ${model.name} from ${file}...`);
	models[model.name] = model;
	log.debug(`Initializing ${model.name}...`);
	models[model.name].initModel(sequelize);
});

// User
models.User.hasMany(models.Discussion, {
	foreignKey: 'ownerId',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

models.User.belongsToMany(models.Discussion, {
	through: models.DiscussionUsers,
	foreignKey: 'userId',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Discussion
models.Discussion.belongsTo(models.User, {
	foreignKey: 'ownerId',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

models.Discussion.belongsToMany(models.User, {
	through: models.DiscussionUsers,
	foreignKey: 'discussionId',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});


import { Model, DataTypes } from 'sequelize';
import log from '../utils/logger';
import { hash, verify } from 'argon2';

class User extends Model {
	public id!: string;
	public username!: string;
	public password!: string;
	public contacts!: User[];

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public async verifyPassword(password: string) {
		const h = this.getDataValue('password');
		return await verify(h, password);
	}

	static initModel(sequelize: any) {
		User.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4(),
					allowNull: false,
					primaryKey: true,
				},
				username: {
					type: DataTypes.STRING(128),
					allowNull: false,
					unique: true,
					set(value: string) {
						// set to lowercase
						const lwc = value.toLowerCase();

						// split into array (separator can be all non-word characters and underscore)
						const arr = lwc.split(/[\W_]+/);

						// capitalize first letter of each word
						const cap = arr.map(word => {
							return word.charAt(0).toUpperCase() + word.slice(1);
						});

						// join array into string
						const str = cap.join('-');

						// set value
						this.setDataValue('username', str);
					},
				},
				password: {
					type: DataTypes.STRING(128),
					allowNull: false,
				},
				},
			{
				sequelize,
				modelName: 'users',
				hasTrigger: true,
				hooks: {
					// Triggered before creating and updating a user to hash the password
					beforeCreate: async (user: User) => {
						log.debug('beforeCreate hook');
						try {
							user.password = await hash(user.password);
						} catch (err) {
							throw new Error('Error hashing password');
						}
					},
					beforeUpdate: async (user: User) => {
						if (user.changed('password')) {
							log.debug('beforeUpdate hook');
							try {
								user.password = await hash(user.password);
							} catch (err) {
								throw new Error('Error hashing password');
							}
						}
					},
				},
			},
		);
	}
}

export default User;

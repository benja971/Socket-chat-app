import { DataTypes, Model, Sequelize } from 'sequelize';
import User from './user.model';

class Message extends Model {
	public id!: string;
	public discussionId!: string;
	public senderId!: string;
	public content!: string;

	public user?: User;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public static initModel(sequelize: Sequelize): void {
		Message.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4(),
					allowNull: false,
					primaryKey: true,
				},
				discussionId: {
					type: DataTypes.UUID,
					allowNull: false,
					references: {
						model: 'discussions',
						key: 'id',
					},
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				},
				senderId: {
					type: DataTypes.UUID,
					allowNull: false,
					references: {
						model: 'users',
						key: 'id',
					},
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				},
				content: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
			},
			{
				sequelize,
				modelName: 'messages',
			},
		);
	}
}

export default Message;

import { DataTypes, Model } from 'sequelize';
import Discussion from './discussion.model';
import User from './user.model';

class DiscussionUsers extends Model {
	public id!: string;
	public discussionId!: string;
	public userId!: string;

	public discussion?: Discussion;
	public user?: User;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public static initModel(sequelize: any): void {
		DiscussionUsers.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
				},
				discussionId: {
					type: DataTypes.UUID,
					allowNull: false,
					unique: 'discussionUsers',
				},
				userId: {
					type: DataTypes.UUID,
					allowNull: false,
					unique: 'discussionUsers',
				},
			},
			{
				sequelize,
				tableName: 'discussionUsers',
			},
		);
	}
}

export default DiscussionUsers;

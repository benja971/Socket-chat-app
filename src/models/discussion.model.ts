import { DataTypes, Model } from 'sequelize';

export type DiscussionType = 'public' | 'private';

class Discussion extends Model {
	public id!: string;
	public title!: string;
	public type!: DiscussionType;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public static associations: {};

	public static initModel(sequelize: any): void {
		Discussion.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4(),
					allowNull: false,
					primaryKey: true,
				},
				title: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				ownerId: {
					type: DataTypes.UUID,
					allowNull: false,
					references: {
						model: 'users',
						key: 'id',
					},
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				},
				type: {
					type: DataTypes.ENUM('public', 'private'),
					allowNull: false,
					defaultValue: 'private',

					validate: {
						isIn: [['public', 'private']],
					},
				},
			},
			{
				sequelize,
				modelName: 'discussions',
			},
		);
	}
}

export default Discussion;

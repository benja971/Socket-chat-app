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
				// TODO: Use Discussion.findOrCreate instead of this
				validate: {
					validateUniquePrivateDiscussion: async function (this: Discussion) {
						// can't have two private discussions with the same title
						if (!this.type || this.type !== 'private') return;

						const discussion = await Discussion.findOne({
							where: {
								title: this.title,
								type: 'private',
							},
						});

						if (!discussion) return;

						if (discussion.id !== this.id) {
							throw new Error('A private discussion with this title already exists');
						}
					},
				},
			},
		);
	}
}

export default Discussion;

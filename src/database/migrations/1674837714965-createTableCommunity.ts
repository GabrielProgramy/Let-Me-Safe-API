import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createTableCommunity1674837714965 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(new Table({
			name: 'community',
			columns: [
				{
					name: 'id',
					type: 'uuid',
					isPrimary: true,
					isUnique: true,
					generationStrategy: 'uuid'
				},
				{
					name: 'name',
					type: 'varchar'
				},
				{
					name: 'description',
					type: 'varchar'
				},
				{
					name: 'privacy',
					type: 'boolean'
				},
				{
					name: 'members',
					type: 'uuid[]',
					isNullable: true
				},
				{
					name: 'owner',
					type: 'uuid'
				}
			],
			foreignKeys: [
				{
					name: 'UserOwner',
					columnNames: ['owner'],
					referencedColumnNames: ['id'],
					referencedTableName: 'users',
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE'
				}
			]
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('users')
	}
}

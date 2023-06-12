import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createTableOcurrence1668913858355 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'ocurrences',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						isUnique: true
					},
					{
						name: 'type',
						type: 'varchar'
					},
					{
						name: 'date',
						type: 'timestamp'
					},
					{
						name: 'status',
						type: 'varchar',
						isNullable: true
					},
					{
						name: 'description',
						type: 'varchar'
					},
					{
						name: 'userId',
						type: 'uuid',
						isNullable: true
					}
				],
				foreignKeys: [
					{
						name: 'OcurrenceUsers',
						columnNames: ['userId'],
						referencedColumnNames: ['id'],
						referencedTableName: 'users'
					}
				]
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('ocurrences')
	}
}

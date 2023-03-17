import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class addCollumBirthDateInUser1678476257471 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('users', new TableColumn({
			name: 'birthDate',
			type: 'date'
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('users', 'birthDate')
	}
}

import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class addAddressInOcurrences1679677199243 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('ocurrences', new TableColumn({
			name: 'address_id',
			type: 'uuid'
		}))
		await queryRunner.createForeignKey('ocurrences', new TableForeignKey({
			name: 'AddressOcurrences',
			columnNames: ['address_id'],
			referencedColumnNames: ['id'],
			referencedTableName: 'address'
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey('ocurrences', 'AddressOcurrences')
		await queryRunner.dropColumn('ocurrences', 'address_id')
	}

}

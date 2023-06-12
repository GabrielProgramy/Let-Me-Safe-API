import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class addAddressInOcurrences1679677199243 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('ocurrences', new TableColumn({
			name: 'addressId',
			type: 'uuid'
		}))
		await queryRunner.createForeignKey('ocurrences', new TableForeignKey({
			name: 'AddressOcurrences',
			columnNames: ['addressId'],
			referencedColumnNames: ['id'],
			referencedTableName: 'address'
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey('ocurrences', 'AddressOcurrences')
		await queryRunner.dropColumn('ocurrences', 'addressId')
	}

}

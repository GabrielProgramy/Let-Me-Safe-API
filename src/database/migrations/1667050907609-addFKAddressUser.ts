import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class addFKAddressUser1667050907609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'AddressUsers',
        columnNames: ['address_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'address',
        onDelete: 'CASCADE'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'AddressUsers')
  }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createTableUser1667050074761 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid'
          },
          {
            name: 'firstName',
            type: 'varchar'
          },
          {
            name: 'lastName',
            type: 'varchar'
          },
          {
            name: 'email',
            type: 'varchar'
          },
          {
            name: 'password',
            type: 'varchar'
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'avatar',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'address_id',
            type: 'uuid',
            isNullable: true
          }
        ],
        foreignKeys: [
          {
            name: 'AddressUsers',
            columnNames: ['address_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'address'
          }
        ]
      }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
  }
}

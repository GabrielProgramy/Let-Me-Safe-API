import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addCollumOcurrence1669048981668 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'ocurrences',
      new TableColumn({
        name: 'location',
        type: 'jsonb',
        isNullable: true
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('ocurrences', 'location')
  }
}

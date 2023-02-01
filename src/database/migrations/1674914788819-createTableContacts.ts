import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createTableContacts1674914788819 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "contacts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isUnique: true,
            generationStrategy: "uuid",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "email",
            type: "varchar",
          },
          {
            name: "phone",
            type: "varchar",
          },
          {
            name: "userId",
            type: "uuid",
          },
        ],
        foreignKeys: [
          {
            name: "FKUser",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["userId"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("contacts");
  }
}

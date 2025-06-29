import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUrl1751152058633 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "url",
                columns: [
                    { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "originalUrl", type: "varchar" },
                    { name: "shortCode", type: "varchar", length: "6", isUnique: true },
                    { name: "clicks", type: "int", default: 0 },
                    { name: "ownerId", type: "int", isNullable: true },
                    { name: "deletedAt", type: "timestamp", isNullable: true },
                    { name: "createdAt", type: "timestamp", default: "now()" },
                    { name: "updatedAt", type: "timestamp", default: "now()" },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "url",
            new TableForeignKey({
                columnNames: ["ownerId"],
                referencedTableName: "user",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("url");
    }

}
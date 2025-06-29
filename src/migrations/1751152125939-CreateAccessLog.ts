import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAccessLog1751152125939 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "access_log",
                columns: [
                    { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "ip", type: "varchar" },
                    { name: "city", type: "varchar", isNullable: true },
                    { name: "region", type: "varchar", isNullable: true },
                    { name: "country", type: "varchar", isNullable: true },
                    { name: "latitude", type: "float", isNullable: true },
                    { name: "longitude", type: "float", isNullable: true },
                    { name: "os", type: "varchar", isNullable: true },
                    { name: "browser", type: "varchar", isNullable: true },
                    { name: "userAgent", type: "varchar" },
                    { name: "accessedAt", type: "timestamp", default: "now()" },
                    { name: "device", type: "varchar", isNullable: true },
                    { name: "urlId", type: "int" },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "access_log",
            new TableForeignKey({
                columnNames: ["urlId"],
                referencedTableName: "url",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("access_log");
    }

}
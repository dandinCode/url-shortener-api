import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDeletedAtToUser1751043717727 implements MigrationInterface {
    name = 'AlterDeletedAtToUser1751043717727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "deletedAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "deletedAt" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "deletedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "deletedAt" SET NOT NULL`);
    }

}

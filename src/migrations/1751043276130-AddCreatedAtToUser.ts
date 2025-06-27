import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToUser1751043276130 implements MigrationInterface {
    name = 'AddCreatedAtToUser1751043276130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    }

}

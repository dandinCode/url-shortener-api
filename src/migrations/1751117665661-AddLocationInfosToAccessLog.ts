import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationInfosToAccessLog1751117665661 implements MigrationInterface {
    name = 'AddLocationInfosToAccessLog1751117665661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "access_log" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "access_log" ADD "latitude" double precision`);
        await queryRunner.query(`ALTER TABLE "access_log" ADD "longitude" double precision`);
        await queryRunner.query(`ALTER TABLE "access_log" ADD "os" character varying`);
        await queryRunner.query(`ALTER TABLE "access_log" ADD "browser" character varying`);
        await queryRunner.query(`ALTER TABLE "access_log" ADD "language" character varying`);
        await queryRunner.query(`ALTER TABLE "access_log" ADD "timezone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "access_log" DROP COLUMN "timezone"`);
        await queryRunner.query(`ALTER TABLE "access_log" DROP COLUMN "language"`);
        await queryRunner.query(`ALTER TABLE "access_log" DROP COLUMN "browser"`);
        await queryRunner.query(`ALTER TABLE "access_log" DROP COLUMN "os"`);
        await queryRunner.query(`ALTER TABLE "access_log" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "access_log" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "access_log" DROP COLUMN "country"`);
    }

}

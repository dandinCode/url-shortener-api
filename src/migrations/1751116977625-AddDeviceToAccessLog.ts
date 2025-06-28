import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceToAccessLog1751116977625 implements MigrationInterface {
    name = 'AddDeviceToAccessLog1751116977625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "access_log" ADD "device" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "access_log" DROP COLUMN "device"`);
    }

}

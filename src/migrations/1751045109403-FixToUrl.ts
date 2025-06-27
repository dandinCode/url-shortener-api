import { MigrationInterface, QueryRunner } from "typeorm";

export class FixToUrl1751045109403 implements MigrationInterface {
    name = 'FixToUrl1751045109403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url" DROP CONSTRAINT "FK_2919f59acab0f44b9a244d35bdb"`);
        await queryRunner.query(`ALTER TABLE "url" DROP COLUMN "clickCount"`);
        await queryRunner.query(`ALTER TABLE "url" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "url" ADD "clicks" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "url" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "url" ADD CONSTRAINT "FK_9c0c4ac421d1607ade76cde1b8b" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url" DROP CONSTRAINT "FK_9c0c4ac421d1607ade76cde1b8b"`);
        await queryRunner.query(`ALTER TABLE "url" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "url" DROP COLUMN "clicks"`);
        await queryRunner.query(`ALTER TABLE "url" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "url" ADD "clickCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "url" ADD CONSTRAINT "FK_2919f59acab0f44b9a244d35bdb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

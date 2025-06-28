import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccessLog1751116233232 implements MigrationInterface {
    name = 'CreateAccessLog1751116233232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "access_log" ("id" SERIAL NOT NULL, "ip" character varying NOT NULL, "city" character varying, "region" character varying, "userAgent" character varying NOT NULL, "accessedAt" TIMESTAMP NOT NULL DEFAULT now(), "urlId" integer, CONSTRAINT "PK_bd09621fb73b42d9e32b85ae41f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "access_log" ADD CONSTRAINT "FK_09b45362a32434832e50f3eac9d" FOREIGN KEY ("urlId") REFERENCES "url"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "access_log" DROP CONSTRAINT "FK_09b45362a32434832e50f3eac9d"`);
        await queryRunner.query(`DROP TABLE "access_log"`);
    }

}

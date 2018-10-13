// tslint:disable:max-line-length quotemark

import { MigrationInterface, QueryRunner } from "typeorm";

export class User1539415517903 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "user" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_cace4a159ff9f2512dd42373760" DEFAULT NEWSEQUENTIALID(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "device_history" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "device_history" ADD "userId" uniqueidentifier NOT NULL`);
    await queryRunner.query(`ALTER TABLE "device_history" ADD CONSTRAINT "FK_5d54592a06dded1a8629423df26" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "device_history" DROP CONSTRAINT "FK_5d54592a06dded1a8629423df26"`);
    await queryRunner.query(`ALTER TABLE "device_history" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "device_history" ADD "userId" nvarchar(255) NOT NULL`);
    await queryRunner.query(`DROP TABLE "user"`);
  }

}

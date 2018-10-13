// tslint:disable:max-line-length quotemark

import { MigrationInterface, QueryRunner } from "typeorm";

export class User1539422705928 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" ADD "mobilePhone" nvarchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "password" nvarchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "createDate" datetime2 NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_456a6c03f0ac80b3a4ae72ffed8" DEFAULT getdate() FOR "createDate"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "updateDate" datetime2 NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_b802fcb424617b0cef57d37901f" DEFAULT getdate() FOR "updateDate"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_b802fcb424617b0cef57d37901f"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updateDate"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_456a6c03f0ac80b3a4ae72ffed8"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createDate"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mobilePhone"`);
  }

}

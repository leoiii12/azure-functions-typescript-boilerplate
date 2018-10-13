// tslint:disable:max-line-length quotemark

import { MigrationInterface, QueryRunner } from "typeorm";

export class Roles1539441290536 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" ADD "roles" ntext NOT NULL DEFAULT ('')`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
  }

}

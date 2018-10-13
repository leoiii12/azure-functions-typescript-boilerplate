// tslint:disable:max-line-length quotemark

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1539347541163 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "general_device" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_057bfe39ef2ad01b9f6e733b662" DEFAULT NEWSEQUENTIALID(), "type" nvarchar(255) NOT NULL, "unit" nvarchar(255) NOT NULL, CONSTRAINT "PK_057bfe39ef2ad01b9f6e733b662" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "device_history" ("id" int NOT NULL IDENTITY(1,1), "userId" nvarchar(255) NOT NULL, "start" datetime NOT NULL, "end" datetime NOT NULL, "deviceId" uniqueidentifier, CONSTRAINT "PK_e7b12f40c596560b264d9cd68f5" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "device" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_2dc10972aa4e27c01378dad2c72" DEFAULT NEWSEQUENTIALID(), "generalDeviceId" uniqueidentifier, CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "device_history" ADD CONSTRAINT "FK_a7eda83dd4b12447ffe7ccc6b6b" FOREIGN KEY ("deviceId") REFERENCES "device"("id")`);
    await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_29e8021cc405d9002561846b1ba" FOREIGN KEY ("generalDeviceId") REFERENCES "general_device"("id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_29e8021cc405d9002561846b1ba"`);
    await queryRunner.query(`ALTER TABLE "device_history" DROP CONSTRAINT "FK_a7eda83dd4b12447ffe7ccc6b6b"`);
    await queryRunner.query(`DROP TABLE "device"`);
    await queryRunner.query(`DROP TABLE "device_history"`);
    await queryRunner.query(`DROP TABLE "general_device"`);
  }

}

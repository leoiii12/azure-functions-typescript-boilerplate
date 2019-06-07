import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1559877528912 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "general_device" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_057bfe39ef2ad01b9f6e733b662" DEFAULT NEWSEQUENTIALID(), "type" nvarchar(255) NOT NULL, "unit" nvarchar(255) NOT NULL, CONSTRAINT "PK_057bfe39ef2ad01b9f6e733b662" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "device" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_2dc10972aa4e27c01378dad2c72" DEFAULT NEWSEQUENTIALID(), "generalDeviceId" uniqueidentifier, CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_cace4a159ff9f2512dd42373760" DEFAULT NEWSEQUENTIALID(), "mobilePhone" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, "roles" ntext NOT NULL, "createDate" datetime2 NOT NULL CONSTRAINT "DF_456a6c03f0ac80b3a4ae72ffed8" DEFAULT getdate(), "updateDate" datetime2 NOT NULL CONSTRAINT "DF_b802fcb424617b0cef57d37901f" DEFAULT getdate(), "tokenVersion" nvarchar(255), "enabled" bit NOT NULL CONSTRAINT "DF_654df1c6ddbd210e467577b6ecc" DEFAULT 1, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "device_history" ("id" int NOT NULL IDENTITY(1,1), "userId" uniqueidentifier NOT NULL, "start" datetime NOT NULL, "end" datetime NOT NULL, "deviceId" uniqueidentifier, CONSTRAINT "PK_e7b12f40c596560b264d9cd68f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_29e8021cc405d9002561846b1ba" FOREIGN KEY ("generalDeviceId") REFERENCES "general_device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_history" ADD CONSTRAINT "FK_a7eda83dd4b12447ffe7ccc6b6b" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_history" ADD CONSTRAINT "FK_5d54592a06dded1a8629423df26" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "device_history" DROP CONSTRAINT "FK_5d54592a06dded1a8629423df26"`);
        await queryRunner.query(`ALTER TABLE "device_history" DROP CONSTRAINT "FK_a7eda83dd4b12447ffe7ccc6b6b"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_29e8021cc405d9002561846b1ba"`);
        await queryRunner.query(`DROP TABLE "device_history"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "device"`);
        await queryRunner.query(`DROP TABLE "general_device"`);
    }

}

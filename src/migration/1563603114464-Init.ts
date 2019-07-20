import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1563603114464 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`EXEC sp_rename "user.mobilePhone", "emailAddress"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`EXEC sp_rename "user.emailAddress", "mobilePhone"`);
    }

}

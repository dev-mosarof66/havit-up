import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAuth1783797477041 implements MigrationInterface {
    name = 'AddUserAuth1783797477041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."habit_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "habit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "time" character varying, "frequency" character varying NOT NULL, "daysOfWeek" integer array NOT NULL, "status" "public"."habit_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_71654d5d0512043db43bac9abfc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "habit_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" character varying(10) NOT NULL, "habitId" uuid, CONSTRAINT "UQ_27e9649bd39fa4531833d6712eb" UNIQUE ("habitId", "date"), CONSTRAINT "PK_fb2ce34f6567722ae951d31547d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "color" character varying NOT NULL DEFAULT '#9ca3af', CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "habit" ADD CONSTRAINT "FK_cc3832692d337c59b1a8fb758b2" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "habit" ADD CONSTRAINT "FK_999000e9ce7a69128f471f0a3f9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "habit_log" ADD CONSTRAINT "FK_31802c29994d04f655b9a2df51d" FOREIGN KEY ("habitId") REFERENCES "habit"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit_log" DROP CONSTRAINT "FK_31802c29994d04f655b9a2df51d"`);
        await queryRunner.query(`ALTER TABLE "habit" DROP CONSTRAINT "FK_999000e9ce7a69128f471f0a3f9"`);
        await queryRunner.query(`ALTER TABLE "habit" DROP CONSTRAINT "FK_cc3832692d337c59b1a8fb758b2"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "habit_log"`);
        await queryRunner.query(`DROP TABLE "habit"`);
        await queryRunner.query(`DROP TYPE "public"."habit_status_enum"`);
    }

}

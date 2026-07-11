import AppDataSource from "./lib/cli-data-source";

async function fix() {
  await AppDataSource.initialize();
  await AppDataSource.query(`INSERT INTO "migrations" ("timestamp", "name") VALUES (1783788930082, 'InitialSchema1783788930082');`);
  await AppDataSource.query(`INSERT INTO "migrations" ("timestamp", "name") VALUES (1783790682752, 'AddStatusColumn1783790682752');`);
  console.log("Fixed");
  process.exit(0);
}

fix().catch(console.error);

import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { Habit } from "./entities/Habit";
import { HabitLog } from "./entities/HabitLog";
import { Category } from "./entities/Category";
import { User } from "./entities/User";

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false, // Turned off for production safety. Migrations will handle schema changes.
  logging: process.env.NODE_ENV === "development",
  entities: [Habit, HabitLog, Category, User],
  subscribers: [],
  migrations: [],
});

const dataSourceSingleton = () => {
  return AppDataSource;
};

declare global {
  var typeormGlobalV4: undefined | ReturnType<typeof dataSourceSingleton>;
}

const dataSource = globalThis.typeormGlobalV4 ?? dataSourceSingleton();

export default dataSource;

if (process.env.NODE_ENV !== "production") {
  globalThis.typeormGlobalV4 = dataSource;
}

// We need to initialize the DataSource if it hasn't been initialized yet.
export async function getDataSource() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
}

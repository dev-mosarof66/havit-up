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
  synchronize: false,
  logging: true,
  entities: [Habit, HabitLog, Category, User],
  migrations: ["lib/migrations/*.ts"],
});

export default AppDataSource;

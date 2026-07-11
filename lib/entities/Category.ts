import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import type { Habit } from "./Habit";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  name!: string;

  @Column({ type: "varchar", default: "#9ca3af" }) // Default gray color
  color!: string;

  @OneToMany("Habit", (habit: Habit) => habit.category)
  habits!: Habit[];
}

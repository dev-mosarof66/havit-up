import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from "typeorm";
import type { Habit } from "./Habit";

@Entity()
@Unique(["habit", "date"])
export class HabitLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne("Habit", (habit: Habit) => habit.logs, { onDelete: "CASCADE" })
  habit!: Habit;

  @Column({ type: "varchar", length: 10 })
  date!: string; // Format: YYYY-MM-DD
}

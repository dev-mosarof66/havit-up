import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from "typeorm";
import type { Relation } from "typeorm";
import { Habit } from "./Habit";

@Entity("habit_log")
@Unique(["habit", "date"])
export class HabitLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Habit, (habit: Habit) => habit.logs, { onDelete: "CASCADE" })
  habit!: Relation<Habit>;

  @Column({ type: "varchar", length: 10 })
  date!: string; // Format: YYYY-MM-DD
}

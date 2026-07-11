import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import type { HabitLog } from "./HabitLog";
import type { Category } from "./Category";
import type { User } from "./User";

@Entity()
export class Habit {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", nullable: true })
  description?: string;

  @Column({ type: "varchar", nullable: true })
  time?: string;

  @Column({ type: "varchar" })
  frequency!: string;

  @Column("int", { array: true })
  daysOfWeek!: number[];

  @Column({
    type: "enum",
    enum: ["active", "inactive"],
    default: "active",
  })
  status!: "active" | "inactive";

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany("HabitLog", (log: HabitLog) => log.habit)
  logs!: HabitLog[];

  @ManyToOne("Category", (category: Category) => category.habits, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "categoryId" })
  category?: Category;

  @Column({ type: "uuid" })
  categoryId!: string;

  @ManyToOne("User", (user: User) => user.habits, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "uuid" })
  userId!: string;
}

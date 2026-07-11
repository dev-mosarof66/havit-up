import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import { HabitLog } from "./HabitLog";
import { Category } from "./Category";
import { User } from "./User";

@Entity("habit")
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

  @OneToMany(() => HabitLog, (log: HabitLog) => log.habit)
  logs!: Relation<HabitLog>[];

  @ManyToOne(() => Category, (category: Category) => category.habits, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "categoryId" })
  category?: Relation<Category>;

  @Column({ type: "uuid" })
  categoryId!: string;

  @ManyToOne(() => User, (user: User) => user.habits, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: Relation<User>;

  @Column({ type: "uuid" })
  userId!: string;
}

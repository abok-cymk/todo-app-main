import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" }) 
  title: string;

  @Column({ type: "boolean", default: false })
  completed: boolean;

  @Column({ type: "boolean", default: false })
  trashed: boolean;

  @Column({ type: "timestamp", nullable: true })
  deletedAt: Date;

  @Column({ type: "integer", default: 0 })
  position: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}

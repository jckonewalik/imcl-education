import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { LessonModel } from "./lesson.model";

@Table({
  tableName: "courses",
  timestamps: true,
})
export class CourseModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column
  name: string;

  @Column
  active: boolean;

  @HasMany(() => LessonModel)
  lessons: LessonModel[];

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;
}

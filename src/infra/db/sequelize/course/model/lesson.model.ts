import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { CourseModel } from "./course.model";

@Table({
  tableName: "lessons",
  timestamps: true,
})
export class LessonModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => CourseModel)
  @Column({
    field: "course_id",
    type: DataType.UUID,
  })
  courseId: string;

  @BelongsTo(() => CourseModel)
  course: CourseModel;

  @Column
  number: number;

  @Column
  name: string;

  @Column
  active: boolean;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;
}

import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { CourseModel } from "../../course/model";
import { TeacherModel } from "../../teacher/model/teacher.model";
import { EnrollmentModel } from "./enrollment.model";
import { StudentClassTeacherModel } from "./student-class-teacher.model";

@Table({
  tableName: "student_classes",
  timestamps: true,
})
export class StudentClassModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => CourseModel)
  @Column({ field: "course_id" })
  courseId: number;

  @BelongsTo(() => CourseModel)
  course: CourseModel;

  @Column
  name: string;

  @Column
  active: boolean;

  @HasMany(() => EnrollmentModel)
  enrollments: EnrollmentModel[];

  @BelongsToMany(() => TeacherModel, () => StudentClassTeacherModel)
  teachers: TeacherModel[];

  @CreatedAt
  @Column({ field: "creation_date" })
  creationDate: Date;

  @UpdatedAt
  @Column({ field: "updated_on" })
  updatedOn: Date;
}

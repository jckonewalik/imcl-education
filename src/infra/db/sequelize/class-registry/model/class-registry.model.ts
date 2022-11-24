import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { LessonModel } from "../../course/model";
import { StudentClassModel } from "../../student-class/model";
import { StudentModel } from "../../student/model";
import { TeacherModel } from "../../teacher/model";
import { ClassRegistryLessonModel } from "./class-registry-lesson.model";
import { ClassRegistryStudentModel } from "./class-registry-student.model";

@Table({
  tableName: "class_registries",
  timestamps: true,
})
export class ClassRegistryModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => StudentClassModel)
  @Column({ field: "student_class_id" })
  studentClassId: string;

  @BelongsTo(() => StudentClassModel)
  studentClass: StudentClassModel;

  @ForeignKey(() => TeacherModel)
  @Column({ field: "teacher_id" })
  teacherId: string;

  @BelongsTo(() => TeacherModel)
  teacher: TeacherModel;

  @Column({ type: DataType.DATEONLY })
  date: Date;

  @BelongsToMany(() => StudentModel, () => ClassRegistryStudentModel)
  students: StudentModel[];

  @BelongsToMany(() => LessonModel, () => ClassRegistryLessonModel)
  lessons: LessonModel[];

  @CreatedAt
  @Column({ field: "creation_date" })
  creationDate: Date;

  @UpdatedAt
  @Column({ field: "updated_on" })
  updatedOn: Date;
}

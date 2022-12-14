import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { StudentClassModel } from ".";

@Table({
  tableName: "student_class_teacher",
  timestamps: false,
})
export class StudentClassTeacherModel extends Model {
  @ForeignKey(() => StudentClassModel)
  @Column({ type: DataType.UUID, field: "student_class_id" })
  studentClassId: string;

  @ForeignKey(() => TeacherModel)
  @Column({ type: DataType.UUID, field: "teacher_id" })
  teacherId: string;
}

import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { StudentModel } from "../../student/model/student.model";
import { StudentClassModel } from "./student-class.model";

@Table({
  tableName: "enrollments",
  timestamps: true,
})
export class EnrollmentModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => StudentClassModel)
  @Column({ type: DataType.UUID, field: "student_class_id" })
  studentClassId: string;

  @ForeignKey(() => StudentModel)
  @Column({ type: DataType.UUID, field: "student_id" })
  studentId: string;

  @CreatedAt
  @Column({ field: "creation_date" })
  creationDate: Date;
}

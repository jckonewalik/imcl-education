import { StudentModel } from "@/infra/db/sequelize/student/model";
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { StudentClassModel } from ".";

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

  @BelongsTo(() => StudentModel)
  student: StudentModel;

  @CreatedAt
  @Column({ field: "creation_date" })
  creationDate: Date;
}

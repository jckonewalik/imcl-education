import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { StudentModel } from "../../student/model";
import { ClassRegistryModel } from "./class-registry.model";

@Table({
  tableName: "class_registry_student",
  timestamps: false,
})
export class ClassRegistryStudentModel extends Model {
  @ForeignKey(() => ClassRegistryModel)
  @Column({ type: DataType.UUID, field: "class_registry_id" })
  classRegistryId: string;

  @ForeignKey(() => StudentModel)
  @Column({ type: DataType.UUID, field: "student_id" })
  studentId: string;
}

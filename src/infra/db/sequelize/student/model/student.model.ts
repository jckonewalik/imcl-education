import { Gender } from "@/domain/@shared/enums/gender";
import { PhoneNumber } from "@/domain/@shared/value-objects";
import { Student } from "@/domain/student/entity/student";
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { StudentClassModel } from "../../student-class/model";

@Table({
  tableName: "students",
  timestamps: true,
})
export class StudentModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column
  name: string;

  @Column
  gender: string;

  @Column({
    field: "phone_number",
  })
  phoneNumber: string;

  @Column({
    field: "phone_is_whatsapp",
  })
  phoneIsWhatsapp: boolean;

  @Column
  active: boolean;

  @ForeignKey(() => StudentClassModel)
  @Column({ type: DataType.UUID, field: "student_class_id" })
  studentClassId: string;

  @CreatedAt
  @Column({ field: "creation_date" })
  creationDate: Date;

  @UpdatedAt
  @Column({ field: "updated_on" })
  updatedOn: Date;

  toEntity(): Student {
    const phoneNumber = !!this.phoneNumber
      ? new PhoneNumber(this.phoneNumber, this.phoneIsWhatsapp)
      : undefined;

    return new Student({
      id: this.id,
      name: this.name,
      gender: Gender[this.gender],
      active: this.active,
      studentClassId: this.studentClassId,
      phone: phoneNumber,
    });
  }
}

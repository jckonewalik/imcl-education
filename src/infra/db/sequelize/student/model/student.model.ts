import { Gender } from "@/domain/@shared/enums/gender";
import { PhoneNumber } from "@/domain/@shared/value-objects";
import { Student } from "@/domain/student/entity/student";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DataType,
} from "sequelize-typescript";

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

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  toEntity(): Student {
    return new Student(
      this.id,
      this.name,
      Gender[this.gender],
      this.active,
      new PhoneNumber(this.phoneNumber, this.phoneIsWhatsapp)
    );
  }
}

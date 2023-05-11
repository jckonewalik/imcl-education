import { Gender } from "@/domain/@shared/enums/gender";
import { PhoneNumber } from "@/domain/@shared/value-objects";
import { Enrollment } from "@/domain/student-class/entity";
import { Student } from "@/domain/student/entity/student";
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
import { EnrollmentModel } from "../../student-class/model";

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

  @HasMany(() => EnrollmentModel)
  enrollments: EnrollmentModel[];

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
    const enrollments = this.enrollments?.map(
      (enrollment) =>
        new Enrollment(
          enrollment.id,
          enrollment.studentClassId,
          enrollment.studentId
        )
    );
    return new Student({
      id: this.id,
      name: this.name,
      gender: Gender[this.gender],
      active: this.active,
      enrollments,
      phone: phoneNumber,
    });
  }
}

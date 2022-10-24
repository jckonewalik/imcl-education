import { Gender } from "@/domain/@shared/enums/gender";
import { Email } from "@/domain/@shared/value-objects";
import { Teacher } from "@/domain/teacher/entity";
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
  tableName: "teachers",
  timestamps: true,
})
export class TeacherModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column
  name: string;

  @Column
  gender: string;

  @Column
  email: string;

  @Column
  active: boolean;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  toEntity(): Teacher {
    return new Teacher(
      this.id,
      this.name,
      Gender[this.gender],
      new Email(this.email),
      this.active
    );
  }
}

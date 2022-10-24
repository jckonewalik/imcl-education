import { UUID } from "sequelize";
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
}

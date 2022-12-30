import { Email } from "@/domain/@shared/value-objects";
import { User } from "@/domain/user/entity/user";
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
import { UserRoleModel } from "./user-role.model";

@Table({
  tableName: "users",
  timestamps: true,
})
export class UserModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.BOOLEAN)
  active: boolean;

  @HasMany(() => UserRoleModel, {
    onDelete: "CASCADE",
  })
  roles: UserRoleModel[];

  @CreatedAt
  @Column({ field: "creation_date" })
  creationDate: Date;

  @UpdatedAt
  @Column({ field: "updated_on" })
  updatedOn: Date;

  toEntity(): User {
    const email = new Email(this.email);
    return new User({
      id: this.id,
      email,
      name: this.name,
      active: this.active,
      roles: this.roles.map((r) => r.toEntity()),
    });
  }
}

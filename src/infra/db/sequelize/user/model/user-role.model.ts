import { Role } from "@/domain/user/entity/role";
import { UserRole } from "@/domain/user/entity/user-role";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { UserModel } from "./user.model";

@Table({
  tableName: "user_roles",
  timestamps: false,
})
export class UserRoleModel extends Model {
  @PrimaryKey
  @ForeignKey(() => UserModel)
  @Column({
    field: "user_id",
    type: DataType.UUID,
  })
  userId: string;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @PrimaryKey
  @Column
  role: string;

  toEntity(): UserRole {
    return new UserRole({
      userId: this.userId,
      role: this.role as Role,
    });
  }
}

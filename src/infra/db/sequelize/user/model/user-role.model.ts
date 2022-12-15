import { Role } from "@/domain/user/entity/role";
import { UserRole } from "@/domain/user/entity/user-role";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { UserModel } from "./user.model";

@Table({
  tableName: "user_roles",
})
export class UserRoleModel extends Model {
  @ForeignKey(() => UserModel)
  @Column({
    field: "user_id",
    type: DataType.UUID,
  })
  userId: string;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @Column
  role: string;

  toEntity(): UserRole {
    return new UserRole({
      userId: this.userId,
      role: this.role as Role,
    });
  }
}

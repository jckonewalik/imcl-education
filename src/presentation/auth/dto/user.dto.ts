import { User } from "@/domain/user/entity/user";
import { ApiProperty } from "@nestjs/swagger";

export class UserDTO {
  @ApiProperty({
    description: "ID do usuário",
  })
  id: string;
  @ApiProperty({
    description: "E-mail do usuário",
  })
  email: string;
  @ApiProperty({
    description: "Nome do usuário",
  })
  name: string;
  @ApiProperty({
    description: "Identificação de status ativo do usuário",
  })
  active: boolean;
  @ApiProperty({
    description: "Permissões do usuário",
  })
  roles: string[];

  private constructor() {}

  static fromEntity(entity: User): UserDTO {
    const dto = new UserDTO();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.email = entity.email.value;
    dto.active = entity.active;

    dto.roles = entity.roles.map((role) => role.role);
    return dto;
  }
}

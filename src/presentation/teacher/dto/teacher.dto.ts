import { Teacher } from "@/domain/teacher/entity";

export class TeacherDto {
  id: string;
  name: string;
  gender: string;
  email: string;
  active: boolean;

  private constructor() {}

  static fromEntity(entity: Teacher): TeacherDto {
    const dto = new TeacherDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.gender = entity.gender;
    dto.email = entity.email.value;
    dto.active = entity.active;
    return dto;
  }
}

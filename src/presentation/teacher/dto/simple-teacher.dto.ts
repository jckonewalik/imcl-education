import { Teacher } from "@/domain/teacher/entity";

export class SimpleTeacherDto {
  id: string;
  name: string;
  email: string;
  active: boolean;

  private constructor() {}

  static fromEntity(entity: Teacher): SimpleTeacherDto {
    const dto = new SimpleTeacherDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.email = entity.email.value;
    dto.active = entity.active;
    return dto;
  }
}

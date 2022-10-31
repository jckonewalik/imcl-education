import { Teacher } from "@/domain/teacher/entity";
import { UpdateTeacherRepository } from "@/domain/teacher/repository";
import { TeacherModel } from "../model";

export class SequelizeUpdateTeacherRepository
  implements UpdateTeacherRepository
{
  async update(entity: Teacher): Promise<void> {
    await TeacherModel.update(
      {
        id: entity.id,
        name: entity.name,
        gender: entity.gender.toString(),
        email: entity.email.value,
        active: entity.active,
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }
}

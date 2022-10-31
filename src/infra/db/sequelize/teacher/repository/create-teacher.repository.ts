import { Teacher } from "@/domain/teacher/entity";
import { CreateTeacherRepository } from "@/domain/teacher/repository";
import { TeacherModel } from "../model";

export class SequelizeCreateTeacherRepository
  implements CreateTeacherRepository
{
  async create(entity: Teacher): Promise<void> {
    await TeacherModel.create({
      id: entity.id,
      name: entity.name,
      gender: entity.gender.toString(),
      email: entity.email.value,
      active: entity.active,
    });
  }
}

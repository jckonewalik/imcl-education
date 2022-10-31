import { Student } from "@/domain/student/entity/student";
import { CreateStudentRepository } from "@/domain/student/repository";
import { StudentModel } from "../model";

export class SequelizeCreateStudentRepository
  implements CreateStudentRepository
{
  async create(entity: Student): Promise<void> {
    await StudentModel.create({
      id: entity.id,
      name: entity.name,
      gender: entity.gender.toString(),
      phoneNumber: entity.phone?.number,
      phoneIsWhatsapp: entity.phone?.isWhatsapp,
      active: entity.active,
    });
  }
}

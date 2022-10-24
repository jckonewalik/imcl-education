import { Student } from "@/domain/student/entity/student";
import { UpdateStudentRepository } from "@/domain/student/repository";
import { StudentModel } from "../model/student.model";

export class SequelizeUpdateStudentRepository
  implements UpdateStudentRepository
{
  async update(entity: Student): Promise<void> {
    await StudentModel.update(
      {
        id: entity.id,
        name: entity.name,
        gender: entity.gender.toString(),
        phoneNumber: entity.phone?.number,
        phoneIsWhatsapp: entity.phone?.isWhatsapp,
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

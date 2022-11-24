import { ClassRegistry } from "@/domain/class-registry/entity";
import { CreateClassRegistryRepository } from "@/domain/class-registry/repository";
import {
  ClassRegistryLessonModel,
  ClassRegistryModel,
  ClassRegistryStudentModel,
} from "../model";

export class SequelizeCreateClassRegistryRepository
  implements CreateClassRegistryRepository
{
  async create(entity: ClassRegistry): Promise<void> {
    const t = await ClassRegistryModel.sequelize?.transaction();
    try {
      await ClassRegistryModel.create({
        id: entity.id,
        studentClassId: entity.studentClassId,
        teacherId: entity.teacherId,
        date: entity.date,
      });
      for (const student of entity.studentIds) {
        await ClassRegistryStudentModel.create({
          classRegistryId: entity.id,
          studentId: student,
        });
      }
      for (const lesson of entity.lessonIds) {
        await ClassRegistryLessonModel.create({
          classRegistryId: entity.id,
          lessonId: lesson,
        });
      }
      await t?.commit();
    } catch (error) {
      await t?.rollback();
    }
  }
}

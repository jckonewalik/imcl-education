import { ClassRegistry } from "@/domain/class-registry/entity";
import { UpdateClassRegistryRepository } from "@/domain/class-registry/repository";
import {
  ClassRegistryLessonModel,
  ClassRegistryModel,
  ClassRegistryStudentModel,
} from "../model";

export class SequelizeUpdateClassRegistryRepository
  implements UpdateClassRegistryRepository
{
  async update(entity: ClassRegistry): Promise<void> {
    const t = await ClassRegistryModel.sequelize?.transaction();
    try {
      const students = entity.studentIds;
      let classStudentModels = await ClassRegistryStudentModel.findAll({
        where: { classRegistryId: entity.id },
      });
      for (const student of students) {
        const exists = classStudentModels.find((m) => m.studentId === student);
        if (!exists) {
          await ClassRegistryStudentModel.create({
            classRegistryId: entity.id,
            studentId: student,
          });
        }
        classStudentModels = classStudentModels.filter(
          (m) => m.studentId !== student
        );
      }
      for (const registry of classStudentModels) {
        await ClassRegistryStudentModel.destroy({
          where: { classRegistryId: entity.id, studentId: registry.studentId },
        });
      }
      const lessons = entity.lessonIds;
      let classLessonsModels = await ClassRegistryLessonModel.findAll({
        where: { classRegistryId: entity.id },
      });
      for (const lesson of lessons) {
        const exists = classLessonsModels.find((m) => m.lessonId === lesson);
        if (!exists) {
          await ClassRegistryLessonModel.create({
            classRegistryId: entity.id,
            lessonId: lesson,
          });
        }
        classLessonsModels = classLessonsModels.filter(
          (m) => m.lessonId !== lesson
        );
      }
      for (const registry of classLessonsModels) {
        await ClassRegistryLessonModel.destroy({
          where: { classRegistryId: entity.id, lessonId: registry.lessonId },
        });
      }
      await ClassRegistryModel.update(
        {
          id: entity.id,
          date: entity.date,
          teacherId: entity.teacherId,
        },
        {
          where: {
            id: entity.id,
          },
        }
      );
      await t?.commit();
    } catch (error) {
      await t?.rollback();
    }
  }
}

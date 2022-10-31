import { Course } from "@/domain/course/entity";
import { UpdateCourseRepository } from "@/domain/course/repository";
import { CourseModel, LessonModel } from "../model";

export class SequelizeUpdateCourseRepository implements UpdateCourseRepository {
  async update(entity: Course): Promise<void> {
    const t = await CourseModel.sequelize?.transaction();
    try {
      const lessons = entity.lessons;
      let lessonModels = await LessonModel.findAll({
        where: { courseId: entity.id },
      });

      for (const lesson of lessons) {
        const exists = lessonModels.find((m) => m.id === lesson.id);
        if (exists) {
          await exists.update({
            active: lesson.active,
          });
        } else {
          await LessonModel.create({
            id: lesson.id,
            courseId: lesson.courseId,
            number: lesson.number,
            name: lesson.name,
            active: lesson.active,
          });
        }
        lessonModels = lessonModels.filter((m) => m.id !== lesson.id);
      }
      for (const lesson of lessonModels) {
        await LessonModel.destroy({
          where: { id: lesson.id },
        });
      }
      await CourseModel.update(
        {
          id: entity.id,
          name: entity.name,
          active: entity.active,
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

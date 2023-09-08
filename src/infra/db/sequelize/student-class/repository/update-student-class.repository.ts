import { StudentClass } from "@/domain/student-class/entity";
import { UpdateStudentClassRepository } from "@/domain/student-class/repository";
import { StudentClassModel, StudentClassTeacherModel } from "../model";

export class SequelizeUpdateStudentClassRepository
  implements UpdateStudentClassRepository
{
  async update(entity: StudentClass): Promise<void> {
    const t = await StudentClassModel.sequelize?.transaction();
    try {
      const teachers = entity.teacherIds;
      let classTeacherModels = await StudentClassTeacherModel.findAll({
        where: { studentClassId: entity.id },
      });

      for (const teacher of teachers) {
        const exists = classTeacherModels.find((m) => m.teacherId === teacher);
        if (!exists) {
          await StudentClassTeacherModel.create({
            studentClassId: entity.id,
            teacherId: teacher,
          });
        }
        classTeacherModels = classTeacherModels.filter(
          (m) => m.teacherId !== teacher
        );
      }

      for (const teacher of classTeacherModels) {
        await StudentClassTeacherModel.destroy({
          where: { studentClassId: entity.id, teacherId: teacher.teacherId },
        });
      }
      await StudentClassModel.update(
        {
          id: entity.id,
          name: entity.name,
          year: entity.year,
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

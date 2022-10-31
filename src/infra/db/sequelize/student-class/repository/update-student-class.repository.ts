import { StudentClass } from "@/domain/student-class/entity";
import { UpdateStudentClassRepository } from "@/domain/student-class/repository";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "../model";

export class SequelizeUpdateStudentClassRepository
  implements UpdateStudentClassRepository
{
  async update(entity: StudentClass): Promise<void> {
    const t = await StudentClassModel.sequelize?.transaction();
    try {
      const enrollments = entity.enrollments;
      let enrollmentModels = await EnrollmentModel.findAll({
        where: { studentClassId: entity.id },
      });

      for (const enrollment of enrollments) {
        const exists = enrollmentModels.find((m) => m.id === enrollment.id);
        if (!exists) {
          await EnrollmentModel.create({
            id: enrollment.id,
            studentClassId: enrollment.classId,
            studentId: enrollment.studentId,
          });
        }
        enrollmentModels = enrollmentModels.filter(
          (m) => m.id !== enrollment.id
        );
      }

      for (const enrollment of enrollmentModels) {
        await EnrollmentModel.destroy({
          where: { id: enrollment.id },
        });
      }

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

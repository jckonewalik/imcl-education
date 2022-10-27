import { StudentClass } from "@/domain/student-class/entity";
import { CreateStudentClassRepository } from "@/domain/student-class/repository";
import { StudentClassModel, StudentClassTeacherModel } from "../model";

export class SequelizeCreateStudentClassRepository
  implements CreateStudentClassRepository
{
  async create(entity: StudentClass): Promise<void> {
    const t = await StudentClassModel.sequelize?.transaction();
    try {
      await StudentClassModel.create(
        {
          id: entity.id,
          courseId: entity.courseId,
          name: entity.name,
          active: entity.active,
          enrollments: entity.enrollments.map((enrollment) => ({
            id: enrollment.id,
            studentClassId: enrollment.classId,
            studentId: enrollment.id,
          })),
        },
        {
          include: ["enrollments"],
        }
      );
      for (const teacher of entity.teacherIds) {
        await StudentClassTeacherModel.create({
          studentClassId: entity.id,
          teacherId: teacher,
        });
      }
      await t?.commit();
    } catch (error) {
      await t?.rollback();
    }
  }
}

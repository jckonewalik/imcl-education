import { StudentClass } from "@/domain/student-class/entity";
import { FindStudentClassRepository } from "@/domain/student-class/repository";
import { StudentClassModel } from "../model";

export class SequelizeFindStudentClassRepository
  implements FindStudentClassRepository
{
  async find(id: string): Promise<StudentClass | undefined> {
    const studentClass = await StudentClassModel.findOne({
      where: { id },
      include: ["teachers", "enrollments"],
    });

    if (!studentClass) {
      return undefined;
    }

    return studentClass.toEntity();
  }
}

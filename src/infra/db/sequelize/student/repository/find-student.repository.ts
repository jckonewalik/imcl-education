import { Student } from "@/domain/student/entity/student";
import { FindStudentRepository } from "@/domain/student/repository";
import { StudentModel } from "../model";

export class SequelizeFindStudentRepository implements FindStudentRepository {
  async find(id: string): Promise<Student | undefined> {
    const studentModel = await StudentModel.findOne({
      where: { id },
    });

    if (!studentModel) {
      return undefined;
    }

    return studentModel.toEntity();
  }
}

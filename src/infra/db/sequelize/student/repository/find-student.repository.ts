import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Student } from "@/domain/student/entity/student";
import { FindStudentRepository } from "@/domain/student/repository";
import { validate } from "uuid";
import { StudentModel } from "../model";
export class SequelizeFindStudentRepository implements FindStudentRepository {
  async find(id: string): Promise<Student | undefined> {
    if (!validate(id)) {
      throw new BadRequestException(Messages.INVALID_ID);
    }

    const studentModel = await StudentModel.findOne({
      where: { id },
    });

    if (!studentModel) {
      return undefined;
    }

    return studentModel.toEntity();
  }
}

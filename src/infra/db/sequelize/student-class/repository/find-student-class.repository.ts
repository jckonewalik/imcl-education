import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "@/domain/student-class/entity";
import { FindStudentClassRepository } from "@/domain/student-class/repository";
import { validate } from "uuid";
import { StudentClassModel } from "../model";
export class SequelizeFindStudentClassRepository
  implements FindStudentClassRepository
{
  async find(id: string): Promise<StudentClass | undefined> {
    if (!validate(id)) {
      throw new BadRequestException(Messages.INVALID_ID);
    }
    const studentClass = await StudentClassModel.findOne({
      where: { id },
      include: ["teachers", "students"],
    });

    if (!studentClass) {
      return undefined;
    }

    return studentClass.toEntity();
  }
}

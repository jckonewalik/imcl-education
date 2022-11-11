import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Teacher } from "@/domain/teacher/entity";
import { FindTeacherRepository } from "@/domain/teacher/repository";
import { validate } from "uuid";
import { TeacherModel } from "../model";
export class SequelizeFindTeacherRepository implements FindTeacherRepository {
  async find(id: string): Promise<Teacher | undefined> {
    if (!validate(id)) {
      throw new BadRequestException(Messages.INVALID_ID);
    }
    const teacherModel = await TeacherModel.findOne({
      where: { id },
    });

    if (!teacherModel) {
      return undefined;
    }

    return teacherModel.toEntity();
  }
}

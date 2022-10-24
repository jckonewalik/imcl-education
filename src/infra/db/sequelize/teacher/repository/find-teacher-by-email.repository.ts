import { Email } from "@/domain/@shared/value-objects";
import { Teacher } from "@/domain/teacher/entity";
import { FindTeacherByEmailRepository } from "@/domain/teacher/repository";
import { TeacherModel } from "../model/teacher.model";

export class SequelizeFindTeacherByEmailRepository
  implements FindTeacherByEmailRepository
{
  async find(email: Email): Promise<Teacher | undefined> {
    const teacherModel = await TeacherModel.findOne({
      where: { email: email.value },
    });

    if (!teacherModel) {
      return undefined;
    }

    return teacherModel.toEntity();
  }
}

import { Teacher } from "@/domain/teacher/entity";
import { FindTeacherRepository } from "@/domain/teacher/repository";
import { TeacherModel } from "../model";

export class SequelizeFindTeacherRepository implements FindTeacherRepository {
  async find(id: string): Promise<Teacher | undefined> {
    const teacherModel = await TeacherModel.findOne({
      where: { id },
    });

    if (!teacherModel) {
      return undefined;
    }

    return teacherModel.toEntity();
  }
}

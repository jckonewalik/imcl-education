import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { FindCourseRepository } from "@/domain/course/repository";
import { StudentClass } from "@/domain/student-class/entity";
import { CreateStudentClassRepository } from "@/domain/student-class/repository";
import StudentClassService from "@/domain/student-class/services/student-class.service";

type CreateProps = {
  courseId: string;
  name: string;
};

export class CreateStudentClassUseCase {
  constructor(
    private readonly createRepo: CreateStudentClassRepository,
    private readonly findCourseRepo: FindCourseRepository
  ) {}

  async create(data: CreateProps): Promise<StudentClass> {
    const course = await this.findCourseRepo.find(data.courseId);
    if (!course) {
      throw new EntityNotFoundException(Messages.INVALID_COURSE);
    }

    const studentClass = StudentClassService.newStudentClass(course, data.name);

    this.createRepo.create(studentClass);
    return studentClass;
  }
}

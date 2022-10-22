import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { FindCourseRepository } from "@/domain/course/repository/course.repository";
import { StudentClass } from "@/domain/student-class/entity";
import { CreateStudentClassRepository } from "@/domain/student-class/repository";
import StudentClassService from "@/domain/student-class/services/student-class.service";
import { CreateStudentClassDto } from "./dto";

export class CreateStudentClassUseCase {
  constructor(
    private readonly createRepo: CreateStudentClassRepository,
    private readonly findCourseRepo: FindCourseRepository
  ) {}

  async create(dto: CreateStudentClassDto): Promise<StudentClass> {
    const course = await this.findCourseRepo.find(dto.courseId);
    if (!course) {
      throw new EntityNotFoundException(Messages.INVALID_COURSE);
    }

    const studentClass = StudentClassService.newStudentClass(course, dto.name);

    this.createRepo.create(studentClass);
    return studentClass;
  }
}

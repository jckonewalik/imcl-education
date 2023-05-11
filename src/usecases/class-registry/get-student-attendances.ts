import { StudentAttendance } from "@/domain/class-registry/entity/student-attendance";
import { FindClassRegitryByStudentClassRepository } from "@/domain/class-registry/repository";

export class GetStudentAttendancesUseCase {
  constructor(
    private readonly findClassRegistryRepo: FindClassRegitryByStudentClassRepository
  ) {}

  async get(
    studentClassId: string,
    studentId: string
  ): Promise<StudentAttendance[]> {
    const registries = await this.findClassRegistryRepo.find(studentClassId);
    const registriesIn = registries.filter((registry) =>
      registry.studentIds.includes(studentId)
    );
    const lessonsMissing = [
      ...new Set(
        registries
          .filter((registry) => !registry.studentIds.includes(studentId))
          .map((registry) => registry.lessonIds)
          .flatMap((id) => id)
      ),
    ];

    const attendaces: StudentAttendance[] = [];
    for (const registry of registriesIn) {
      registry.lessonIds.forEach((id) => {
        attendaces.push(
          new StudentAttendance({
            studentClassId,
            studentId,
            lessonId: id,
            date: registry.date,
            finished: true,
          })
        );
      });
    }
    lessonsMissing
      .filter((lessonId) => !attendaces.find((a) => a.lessonId === lessonId))
      .forEach((lessonId) =>
        attendaces.push(
          new StudentAttendance({
            studentClassId,
            studentId,
            lessonId,
            finished: false,
          })
        )
      );

    return attendaces;
  }
}

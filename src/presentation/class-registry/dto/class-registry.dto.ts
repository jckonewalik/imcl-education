import { DateUtils } from "@/domain/@shared/util/date-utils";
import { ClassRegistry } from "@/domain/class-registry/entity";
import { Course } from "@/domain/course/entity";
import { StudentClass } from "@/domain/student-class/entity";
import { Student } from "@/domain/student/entity";
import { Teacher } from "@/domain/teacher/entity";
import { LessonDto } from "@/presentation/course/dto";
import { SimpleStudentClassDto } from "@/presentation/student-class/dto";
import { SimpleStudentDto } from "@/presentation/student/dto";
import { SimpleTeacherDto } from "@/presentation/teacher/dto/simple-teacher.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ClassRegistryDto {
  @ApiProperty({
    description: "ID do registro",
  })
  id: string;
  @ApiProperty({
    description: "Turma",
    type: SimpleStudentClassDto,
  })
  studentClass: SimpleStudentClassDto;
  @ApiProperty({
    description: "Professor",
    type: SimpleTeacherDto,
  })
  teacher: SimpleTeacherDto;
  @ApiProperty({
    description: "Data do registro",
  })
  date: string;
  @ApiProperty({
    description: "Alunos",
    type: SimpleStudentDto,
  })
  students: SimpleStudentDto[];
  @ApiProperty({
    description: "Lições",
    type: LessonDto,
  })
  lessons: LessonDto[];

  static create(
    registry: ClassRegistry,
    studentClass?: StudentClass,
    teacher?: Teacher,
    course?: Course,
    students?: Student[]
  ): ClassRegistryDto {
    const dto = new ClassRegistryDto();
    dto.id = registry.id;
    dto.date = DateUtils.toIsoDate(registry.date);
    if (studentClass) {
      dto.studentClass = SimpleStudentClassDto.create(studentClass, course);
    }
    if (teacher) {
      dto.teacher = SimpleTeacherDto.fromEntity(teacher);
    }
    dto.students = students?.map((s) => SimpleStudentDto.fromEntity(s)) || [];
    const lessons = course?.lessons.filter((l) =>
      registry.lessonIds.includes(l.id)
    );
    dto.lessons = lessons?.map((l) => LessonDto.fromEntity(l)) || [];
    return dto;
  }
}

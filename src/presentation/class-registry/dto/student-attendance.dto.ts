import { DateUtils } from "@/domain/@shared/util/date-utils";
import Messages from "@/domain/@shared/util/messages";
import { StudentAttendance } from "@/domain/class-registry/entity/student-attendance";
import { Course } from "@/domain/course/entity";
import { StudentClass } from "@/domain/student-class/entity";
import { Student } from "@/domain/student/entity";
import { LessonDto } from "@/presentation/course/dto";
import { SimpleStudentClassDto } from "@/presentation/student-class/dto";
import { SimpleStudentDto } from "@/presentation/student/dto";
import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class AttendanceDto {
  @ApiProperty({
    description: "Lição",
    type: LessonDto,
  })
  lesson: LessonDto;
  @ApiProperty({
    description: "Data",
    format: "YYYY-MM-DD",
  })
  date?: string;
  @ApiProperty({
    description: "Concluído?",
  })
  finished: boolean;
}

type Props = {
  course: Course;
  studentClass: StudentClass;
  student: Student;
  attendances?: StudentAttendance[];
};

export class StudentAttendancesDto {
  @ApiProperty({
    description: "Turma",
    type: SimpleStudentClassDto,
  })
  studentClass?: SimpleStudentClassDto;
  @ApiProperty({
    description: "Aluno",
    type: SimpleStudentDto,
  })
  student?: SimpleStudentDto;
  @ApiProperty({
    description: "Lições",
    type: AttendanceDto,
  })
  lessons: AttendanceDto[] = [];

  static create({ course, studentClass, student, attendances = [] }: Props) {
    const dto = new StudentAttendancesDto();
    dto.studentClass = SimpleStudentClassDto.create(studentClass, course);
    dto.student = SimpleStudentDto.fromEntity(student);

    for (const attendance of attendances) {
      const lesson = course.lessons.find((l) => l.id === attendance.lessonId);
      if (!lesson) {
        throw new BadRequestException(Messages.INVALID_LESSON);
      }
      dto.lessons.push({
        lesson: LessonDto.fromEntity(lesson),
        date: attendance.date && DateUtils.toIsoDate(attendance.date),
        finished: attendance.finished,
      });
    }
    return dto;
  }
}

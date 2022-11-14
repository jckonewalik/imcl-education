import { Course } from "@/domain/course/entity";
import { StudentClass } from "@/domain/student-class/entity";
import { Student } from "@/domain/student/entity";
import { Teacher } from "@/domain/teacher/entity";
import { SimpleCourseDto } from "@/presentation/course/dto";
import { SimpleStudentDto } from "@/presentation/student/dto";
import { SimpleTeacherDto } from "@/presentation/teacher/dto/simple-teacher.dto";
import { ApiProperty } from "@nestjs/swagger";

export class StudentClassDto {
  @ApiProperty({
    description: "ID do turma",
  })
  id: string;
  @ApiProperty({
    description: "Curso da turma",
    type: SimpleCourseDto,
  })
  course: SimpleCourseDto;
  @ApiProperty({
    description: "Nome do turma",
  })
  name: string;
  @ApiProperty({
    description: "Professores da turma",
    type: SimpleTeacherDto,
  })
  teachers: SimpleTeacherDto[];
  @ApiProperty({
    description: "Alunos da turma",
    type: SimpleStudentDto,
  })
  students: SimpleStudentDto[];
  @ApiProperty({
    description: "Identificação de status ativo do turma",
    required: true,
  })
  active: boolean;

  private constructor() {}

  static create(
    studentClass: StudentClass,
    course: Course,
    teachers: Teacher[] = [],
    students: Student[] = []
  ): StudentClassDto {
    const dto = new StudentClassDto();
    dto.id = studentClass.id;
    dto.course = SimpleCourseDto.fromEntity(course);
    dto.name = studentClass.name;
    dto.active = studentClass.active;
    dto.teachers = teachers.map((t) => SimpleTeacherDto.fromEntity(t));
    dto.students = students.map((s) => SimpleStudentDto.fromEntity(s));

    return dto;
  }
}

import { Course } from "@/domain/course/entity";
import { StudentClass } from "@/domain/student-class/entity";
import { SimpleCourseDto } from "@/presentation/course/dto";
import { ApiProperty } from "@nestjs/swagger";

export class SimpleStudentClassDto {
  @ApiProperty({
    description: "ID da turma",
  })
  id: string;
  @ApiProperty({
    description: "Curso",
    type: SimpleCourseDto,
  })
  course?: SimpleCourseDto;
  @ApiProperty({
    description: "nome da turma",
  })
  name: string;
  @ApiProperty({
    description: "Ano da turma",
  })
  year?: number;
  @ApiProperty({
    description: "Identificação de status ativo da turma",
  })
  active: boolean;

  private constructor() {}

  static create(
    studentClass: StudentClass,
    course?: Course
  ): SimpleStudentClassDto {
    const dto = new SimpleStudentClassDto();
    dto.id = studentClass.id;
    dto.course = course && SimpleCourseDto.fromEntity(course);
    dto.name = studentClass.name;
    dto.year = studentClass.year;
    dto.active = studentClass.active;
    return dto;
  }
}

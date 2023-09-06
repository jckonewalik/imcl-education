import { Course } from "@/domain/course/entity";
import { StudentClass } from "@/domain/student-class/entity";
import { Student } from "@/domain/student/entity";
import { SimpleStudentClassDto } from "@/presentation/student-class/dto";
import { ApiProperty } from "@nestjs/swagger";
import { PhoneNumberDto } from "./phone-number.dto";

export class StudentDto {
  @ApiProperty({
    description: "ID do aluno",
  })
  id: string;
  @ApiProperty({
    description: "Nome do aluno",
  })
  name: string;
  @ApiProperty({
    enum: ["F", "M"],
    description: "Gênero do aluno",
  })
  gender: string;
  @ApiProperty({
    description: "Identificação de status ativo do aluno",
  })
  active: boolean;
  @ApiProperty({
    description: "Telefone do aluno",
    required: false,
    type: PhoneNumberDto,
  })
  phone: PhoneNumberDto;
  @ApiProperty({
    description: "Turma do aluno",
  })
  studentClass: SimpleStudentClassDto;

  private constructor() {}

  static create(
    student: Student,
    studentClass: StudentClass,
    course: Course
  ): StudentDto {
    const dto = new StudentDto();
    dto.id = student.id;
    dto.name = student.name;
    dto.gender = student.gender;
    dto.active = student.active;
    if (student.phone) {
      dto.phone = {
        number: student.phone.number,
        isWhatsapp: student.phone.isWhatsapp,
      };
    }
    dto.studentClass = SimpleStudentClassDto.create(studentClass, course);

    return dto;
  }
}

import Messages from "@/domain/@shared/util/messages";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateClassRegistryDto {
  @ApiProperty({
    description: "ID do turma",
    required: true,
  })
  @IsNotEmpty({
    message: Messages.MISSING_STUDENT_CLASS_ID,
  })
  studentClassId: string;
  @ApiProperty({
    description: "ID do professor",
    required: true,
  })
  @IsNotEmpty({
    message: Messages.MISSING_TEACHER_ID,
  })
  teacherId: string;
  @IsDateString(
    {},
    {
      message: Messages.INVALID_DATE_FORMAT,
    }
  )
  @ApiProperty({
    description: "Data do registro",
    required: true,
  })
  date: string;
  @ApiProperty({
    description: "ID dos alunos",
    required: true,
  })
  studentIds: string[];
  @ApiProperty({
    description: "ID das lições",
    required: false,
  })
  lessonIds: string[];
}

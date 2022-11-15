import Messages from "@/domain/@shared/util/messages";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateStudentClassDto {
  @ApiProperty({
    description: "ID do curso",
    required: true,
  })
  @IsNotEmpty({
    message: Messages.MISSING_COURSE_ID,
  })
  courseId: string;
  @ApiProperty({
    description: "Nome da turma",
    required: true,
  })
  name: string;
  @ApiProperty({
    description: "Ano da turma",
    required: false,
  })
  year?: number;
}

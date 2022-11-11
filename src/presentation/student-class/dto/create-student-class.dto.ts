import Messages from "@/domain/@shared/util/messages";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateStudentClassDto {
  @ApiProperty({
    description: "ID do curso",
    required: true,
  })
  @IsUUID("4", {
    message: Messages.INVALID_ID,
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
}

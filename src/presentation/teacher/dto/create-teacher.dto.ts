import { Gender } from "@/domain/@shared/enums/gender";
import Messages from "@/domain/@shared/util/messages";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

export class CreateTeacherDto {
  @ApiProperty({
    description: "Nome do professor",
    required: true,
  })
  name: string;

  @ApiProperty({
    description: "Gênero do professor",
    enum: ["F", "M"],
    required: true,
  })
  @IsIn([Gender.M, Gender.F], { message: Messages.INVALID_GENDER })
  gender: Gender.F | Gender.M;

  @ApiProperty({
    description: "E-mail do professor",
    required: true,
  })
  email: string;
}

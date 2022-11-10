import { Gender } from "@/domain/@shared/enums/gender";
import Messages from "@/domain/@shared/util/messages";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";
import { PhoneNumberDto } from "./phone-number.dto";

export class CreateStudentDto {
  @ApiProperty({
    description: "Nome do aluno",
    required: true,
  })
  name: string;

  @ApiProperty({
    description: "Gênero do aluno",
    enum: ["F", "M"],
    required: true,
  })
  @IsIn([Gender.M, Gender.F], { message: Messages.INVALID_GENDER })
  gender: Gender.F | Gender.M;

  @ApiProperty({
    type: PhoneNumberDto,
    required: false,
  })
  phone?: PhoneNumberDto;
}

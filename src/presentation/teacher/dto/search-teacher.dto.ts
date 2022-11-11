import { Gender } from "@/domain/@shared/enums/gender";
import Messages from "@/domain/@shared/util/messages";
import { SearchDto } from "@/presentation/@shared/dto/search.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, ValidateIf } from "class-validator";

export class SearchTeacherDto extends SearchDto {
  @ApiProperty({
    required: false,
    description: "Nome do professor",
  })
  name?: string;
  @ApiProperty({
    required: false,
    description: "E-mail do professor",
  })
  email?: string;
  @ApiProperty({
    required: false,
    description: "Gênero do professor",
    enum: ["F", "M"],
  })
  @ValidateIf((o) => o.gender !== undefined)
  @IsIn([Gender.M, Gender.F], { message: Messages.INVALID_GENDER })
  gender?: Gender.F | Gender.M;
  @ApiProperty({
    required: false,
    description: "Identificação de status ativo do professor",
  })
  active?: boolean;
}

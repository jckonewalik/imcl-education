import { Gender } from "@/domain/@shared/enums/gender";
import Messages from "@/domain/@shared/util/messages";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, Min, ValidateIf } from "class-validator";

export class SearchTeacherDto {
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
  @ApiProperty({
    required: false,
    description: "Número da página",
  })
  @ValidateIf((o) => o.page !== undefined)
  @Min(1, { message: Messages.INVALID_PAGE_NUMBER })
  page?: number;
  @ApiProperty({
    required: false,
    description: "Número de registros",
  })
  @ValidateIf((o) => o.lines !== undefined)
  @Min(1, { message: Messages.INVALID_LINES_NUMBER })
  lines?: number;
}

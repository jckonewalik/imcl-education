import Messages from "@/domain/@shared/util/messages";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, Min, ValidateIf } from "class-validator";

export class SearchCourseDto {
  @ApiProperty({
    required: false,
    description: "Nome do curso",
  })
  name?: string;
  @ApiProperty({
    required: false,
    description: "Identificação de status ativo do curso",
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
  @ApiProperty({
    required: false,
    description: "Ordenar por",
  })
  sortBy?: string;
  @ApiProperty({
    required: false,
    description: "Ordem dos dados",
  })
  @ValidateIf((o) => o.sortOrder !== undefined)
  @IsIn(["ASC", "DESC"], { message: Messages.INVALID_SORT_ORDER })
  sortOrder?: "ASC" | "DESC";
}

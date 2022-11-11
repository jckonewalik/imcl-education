import { SearchDto } from "@/presentation/@shared/dto/search.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SearchCourseDto extends SearchDto {
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
}

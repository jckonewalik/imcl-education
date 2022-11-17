import { SearchDto } from "@/presentation/@shared/dto/search.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SearchStudentClassDto extends SearchDto {
  @ApiProperty({
    required: false,
    description: "Nome da turma",
  })
  name?: string;
  @ApiProperty({
    required: false,
    description: "ID do curso",
  })
  courseId?: string;
  @ApiProperty({
    required: false,
    description: "Ano da turma",
  })
  year?: number;
  @ApiProperty({
    required: false,
    description: "Identificação de status ativo da turma",
  })
  active?: boolean;
}

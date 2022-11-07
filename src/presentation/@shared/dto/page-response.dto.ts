import { ApiProperty } from "@nestjs/swagger";

export class PageResponseDto<T> {
  @ApiProperty({
    description: "Total de registros",
  })
  totalItems: number;
  @ApiProperty({
    description: "Registros",
  })
  data: T[];
  @ApiProperty({
    description: "Total de páginas",
  })
  totalPages: number;
  @ApiProperty({
    description: "Página atual",
  })
  currentPage: number;
}

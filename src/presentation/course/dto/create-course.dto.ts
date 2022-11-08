import { ApiProperty } from "@nestjs/swagger";

export class CreateCourseDto {
  @ApiProperty({
    description: "Nome do curso",
    required: true,
  })
  name: string;
}

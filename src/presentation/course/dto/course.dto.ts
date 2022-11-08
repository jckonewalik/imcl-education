import { Course } from "@/domain/course/entity";
import { ApiProperty } from "@nestjs/swagger";
import { LessonDto } from "./lesson.dto";

export class CourseDto {
  @ApiProperty({
    description: "ID do curso",
  })
  id: string;
  @ApiProperty({
    description: "Nome do curso",
  })
  name: string;
  @ApiProperty({
    description: "Identificação de status ativo do curso",
  })
  active: boolean;

  @ApiProperty({
    description: "Lições do curso",
    type: LessonDto,
    required: false,
  })
  lessons: LessonDto[];

  private constructor() {}

  static fromEntity(entity: Course): CourseDto {
    const dto = new CourseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.active = entity.active;
    dto.lessons = entity.lessons.map((l) => LessonDto.fromEntity(l));
    return dto;
  }
}

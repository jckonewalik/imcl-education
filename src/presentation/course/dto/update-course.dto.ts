import Messages from "@/domain/@shared/util/messages";
import { UpdateAction } from "@/usecases/@shared/enums";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, Min } from "class-validator";

export class UpdateLessonDto {
  @ApiProperty({
    description: "ID da lição",
    required: false,
  })
  id?: string;
  @ApiProperty({
    description: "Nome da lição",
    required: true,
  })
  name: string;
  @Min(1, { message: Messages.INVALID_LESSON_NUMBER })
  @ApiProperty({
    description: "Número da lição",
    required: true,
  })
  number: number;
  @ApiProperty({
    description: "Ação da atualização da lição",
    required: true,
    enum: UpdateAction,
  })
  @IsIn([UpdateAction.A, UpdateAction.D, UpdateAction.I], {
    message: Messages.INVALID_UPDATE_ACTION,
  })
  action: UpdateAction;
}

export class UpdateCourseDto {
  @ApiProperty({
    description: "Nome do curso",
    required: true,
  })
  name: string;
  @ApiProperty({
    description: "Identificação de status ativo do curso",
    required: true,
  })
  active: boolean;
  @ApiProperty({
    description: "Atualização das Lições",
    required: false,
    type: UpdateLessonDto,
  })
  lessons?: UpdateLessonDto[];
}

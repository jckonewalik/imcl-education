import Messages from "@/domain/@shared/util/messages";
import { UpdateAction } from "@/usecases/@shared/enums";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsIn, IsNotEmpty } from "class-validator";

class UpdateClassRegistryStudentDto {
  @ApiProperty({
    description: "ID do aluno",
    required: true,
  })
  @IsNotEmpty({
    message: Messages.MISSING_STUDENT_ID,
  })
  studentId: string;
  @ApiProperty({
    description: "Ação da atualização do aluno",
    required: true,
    enum: UpdateAction,
  })
  @IsIn([UpdateAction.A, UpdateAction.D, UpdateAction.I], {
    message: Messages.INVALID_UPDATE_ACTION,
  })
  action: UpdateAction;
}

class UpdateClassRegistryLessonDto {
  @ApiProperty({
    description: "ID da lição",
    required: true,
  })
  @IsNotEmpty({
    message: Messages.MISSING_LESSON_ID,
  })
  lessonId: string;
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

export class UpdateClassRegistryDto {
  @ApiProperty({
    description: "ID do professor",
    required: true,
  })
  @IsNotEmpty({
    message: Messages.MISSING_TEACHER_ID,
  })
  teacherId: string;
  @IsDateString(
    {},
    {
      message: Messages.INVALID_DATE_FORMAT,
    }
  )
  @ApiProperty({
    description: "Data do registro",
    required: true,
  })
  date: string;
  @ApiProperty({
    description: "Atualização dos alunos",
    required: false,
    type: UpdateClassRegistryStudentDto,
  })
  student: UpdateClassRegistryStudentDto[];
  @ApiProperty({
    description: "Atualização dos alunos",
    required: false,
    type: UpdateClassRegistryLessonDto,
  })
  lessons: UpdateClassRegistryLessonDto[];
}

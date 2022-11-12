import Messages from "@/domain/@shared/util/messages";
import { UpdateAction } from "@/usecases/@shared/enums";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty } from "class-validator";

class UpdateStudentClassTeacherDto {
  @ApiProperty({
    description: "ID do professor",
    required: true,
  })
  @IsNotEmpty({
    message: Messages.MISSING_TEACHER_ID,
  })
  teacherId: string;
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

class UpdateStudentClassStudentDto {
  @ApiProperty({
    description: "ID do aluno",
    required: true,
  })
  @IsNotEmpty({
    message: Messages.MISSING_STUDENT_ID,
  })
  studentId: string;
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

export class UpdateStudentClassDto {
  @ApiProperty({
    description: "Nome da turma",
    required: true,
  })
  name: string;
  @ApiProperty({
    description: "Identificação de status ativo do turma",
    required: true,
  })
  active: boolean;
  @ApiProperty({
    description: "Atualização dos alunos",
    required: false,
    type: UpdateStudentClassStudentDto,
  })
  students?: UpdateStudentClassStudentDto[];
  @ApiProperty({
    description: "Atualização dos professores",
    required: false,
    type: UpdateStudentClassTeacherDto,
  })
  teachers?: UpdateStudentClassTeacherDto[];
}

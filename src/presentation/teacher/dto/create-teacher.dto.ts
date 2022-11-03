import { Gender } from "@/domain/@shared/enums/gender";
import Messages from "@/domain/@shared/util/messages";
import { IsIn } from "class-validator";

export class CreateTeacherDto {
  name: string;

  @IsIn([Gender.M, Gender.F], { message: Messages.INVALID_GENDER })
  gender: Gender.F | Gender.M;

  email: string;
}

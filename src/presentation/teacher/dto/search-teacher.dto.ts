import { Gender } from "@/domain/@shared/enums/gender";
import Messages from "@/domain/@shared/util/messages";
import { IsIn, Min, ValidateIf } from "class-validator";

export class SearchTeacherDto {
  name?: string;
  email?: string;
  @ValidateIf((o) => o.gender !== undefined)
  @IsIn([Gender.M, Gender.F], { message: Messages.INVALID_GENDER })
  gender?: Gender.F | Gender.M;
  active?: boolean;
  @ValidateIf((o) => o.page !== undefined)
  @Min(1, { message: Messages.INVALID_PAGE_NUMBER })
  page?: number;
  @ValidateIf((o) => o.lines !== undefined)
  @Min(1, { message: Messages.INVALID_LINES_NUMBER })
  lines?: number;
}

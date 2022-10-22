import { Gender } from "@/domain/@shared/enums/gender";

export type CreateTeacherDto = {
  name: string;
  gender: Gender;
  email: string;
};

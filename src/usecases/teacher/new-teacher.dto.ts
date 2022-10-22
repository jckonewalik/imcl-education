import { Gender } from "@/domain/@shared/enums/gender";

export type NewTeacherDto = {
  name: string;
  gender: Gender;
  email: string;
};

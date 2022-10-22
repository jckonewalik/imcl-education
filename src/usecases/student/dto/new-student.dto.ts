import { Gender } from "@/domain/@shared/enums/gender";

export type NewStudentDto = {
  name: string;
  gender: Gender;
  phone?: {
    number: string;
    isWhatsapp: boolean;
  };
};

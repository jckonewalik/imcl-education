import { UpdateAction } from "@/usecases/@shared/enums";

export type UpdateCourseDto = {
  id: string;
  name: string;
  active: boolean;
  lessons?: UpdateLessonDto[];
};

type UpdateLessonDto = {
  id?: string;
  name: string;
  number: number;
  action: UpdateAction;
};

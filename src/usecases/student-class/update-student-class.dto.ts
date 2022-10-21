import { UpdateAction } from "../@shared/enums";

export type UpdateStudentClassDto = {
  id: string;
  name: string;
  active: boolean;
  students?: UpdateStudentDto[];
};

type UpdateStudentDto = {
  studentId: string;
  action: UpdateAction;
};

type UpdateTeacherDto = {
  teacherId: string;
  action: UpdateAction;
};

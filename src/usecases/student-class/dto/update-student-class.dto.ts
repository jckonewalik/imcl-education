import { UpdateAction } from "@/usecases/@shared/enums";

export type UpdateStudentClassDto = {
  id: string;
  name: string;
  active: boolean;
  students?: UpdateStudentDto[];
  teachers?: UpdateTeacherDto[];
};

type UpdateStudentDto = {
  studentId: string;
  action: UpdateAction;
};

type UpdateTeacherDto = {
  teacherId: string;
  action: UpdateAction;
};

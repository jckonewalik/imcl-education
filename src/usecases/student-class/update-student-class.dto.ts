export type UpdateStudentClassDto = {
  id: string;
  name: string;
  active: boolean;
  students?: UpdateStudentDto[];
};

type UpdateStudentDto = {
  studentId: string;
  action: "A" | "D";
};

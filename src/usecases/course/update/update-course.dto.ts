export type UpdateCourseDto = {
  id: string;
  lessons: UpdateLessonDto[];
};

type UpdateLessonDto = {
  id?: string;
  name: string;
  number: number;
  action: "A" | "D" | "I";
};

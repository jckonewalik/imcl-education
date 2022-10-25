import { Course } from "@/domain/course/entity";
import { v4 as uuid } from "uuid";
import faker from "faker";
export const makeCourse = () => {
  const course = new Course(uuid(), faker.random.word(), true);
  course.addLesson(1, faker.random.word());
  course.addLesson(2, faker.random.word());
  return course;
};

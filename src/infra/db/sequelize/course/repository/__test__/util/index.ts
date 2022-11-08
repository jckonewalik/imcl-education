import { Course } from "@/domain/course/entity";
import faker from "faker";
import { v4 as uuid } from "uuid";
export const makeCourse = ({ name = faker.random.word(), active = true }) => {
  const course = new Course(uuid(), name, active);
  course.addLesson(1, faker.random.word());
  course.addLesson(2, faker.random.word());
  return course;
};

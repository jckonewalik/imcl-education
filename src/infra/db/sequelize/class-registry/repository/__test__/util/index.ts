import { Gender } from "@/domain/@shared/enums/gender";
import { CourseModel } from "@/infra/db/sequelize/course/model";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import faker from "faker";
import { v4 as uuid } from "uuid";

export const makeModels = async () => {
  const courseId = uuid();
  const course = await CourseModel.create(
    {
      id: courseId,
      name: faker.random.word(),
      active: true,
      lessons: [
        {
          id: uuid(),
          courseId: courseId,
          number: 1,
          name: faker.random.word(),
          active: true,
        },
      ],
    },
    { include: "lessons" }
  );

  const teacher = await TeacherModel.create({
    id: uuid(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    gender: Gender.F,
    email: faker.internet.email(),
    active: true,
  });

  const student = await StudentModel.create({
    id: uuid(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    gender: Gender.M,
    active: true,
  });

  const studentClass = await StudentClassModel.create({
    id: uuid(),
    courseId: course.id,
    name: faker.random.word(),
    year: new Date().getFullYear(),
    active: true,
  });

  await EnrollmentModel.create({
    id: uuid(),
    studentClassId: studentClass.id,
    studentId: student.id,
  });

  await StudentClassTeacherModel.create({
    studentClassId: studentClass.id,
    teacherId: teacher.id,
  });

  return { course, teacher, student, studentClass };
};

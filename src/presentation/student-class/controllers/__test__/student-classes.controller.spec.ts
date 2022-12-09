import { Gender } from "@/domain/@shared/enums/gender";
import Messages from "@/domain/@shared/util/messages";
import {
  ClassRegistryLessonModel,
  ClassRegistryModel,
  ClassRegistryStudentModel,
} from "@/infra/db/sequelize/class-registry/model";
import { makeModels } from "@/infra/db/sequelize/class-registry/repository/__test__/util";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { StudentClassesModule } from "@/modules/student-classes.module";
import { StudentAttendancesDto } from "@/presentation/class-registry/dto";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { v4 as uuid } from "uuid";
import { StudentClassDto } from "../../dto";

const createCourse = async (): Promise<CourseModel> => {
  const course = await CourseModel.create({
    id: uuid(),
    name: faker.random.word(),
    active: true,
  });
  return course;
};

const createTeacher = async (): Promise<TeacherModel> => {
  const teacher = await TeacherModel.create({
    id: uuid(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: `${faker.internet.email()}`,
    gender: Gender.M,
    active: true,
  });
  return teacher;
};

const createStudent = async (): Promise<StudentModel> => {
  const student = await StudentModel.create({
    id: uuid(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    gender: Gender.M,
    active: true,
  });
  return student;
};

const makeClassRegistries = async () => {
  const { course, studentClass, teacher1, teacher2, student1, student2 } =
    await makeModels();

  const registry1 = await ClassRegistryModel.create({
    id: uuid(),
    studentClassId: studentClass.id,
    teacherId: teacher1.id,
    date: new Date(),
  });
  await ClassRegistryStudentModel.create({
    studentId: student1.id,
    classRegistryId: registry1.id,
  });
  await ClassRegistryLessonModel.create({
    classRegistryId: registry1.id,
    lessonId: course.lessons[0].id,
  });

  const registry2 = await ClassRegistryModel.create({
    id: uuid(),
    studentClassId: studentClass.id,
    teacherId: teacher1.id,
    date: new Date(),
  });
  await ClassRegistryStudentModel.create({
    studentId: student2.id,
    classRegistryId: registry2.id,
  });
  await ClassRegistryLessonModel.create({
    classRegistryId: registry2.id,
    lessonId: course.lessons[1].id,
  });

  return {
    course,
    studentClass,
    teacher1,
    teacher2,
    student1,
    student2,
    registry1,
    registry2,
  };
};

describe("Student Classes Controller Tests", () => {
  let app: INestApplication;

  const databaseProviders = [
    {
      provide: "SEQUELIZE",
      useFactory: async () => {
        const sequelize = new Sequelize({
          dialect: "sqlite",
          storage: ":memory:",
          logging: false,
          sync: { force: true },
        });

        await sequelize.addModels([
          CourseModel,
          LessonModel,
          StudentClassModel,
          EnrollmentModel,
          StudentClassTeacherModel,
          TeacherModel,
          StudentModel,
          ClassRegistryModel,
          ClassRegistryLessonModel,
          ClassRegistryStudentModel,
        ]);
        await sequelize.sync();
      },
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [...databaseProviders],
      imports: [StudentClassesModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it(`/POST student-classes`, async () => {
    const course = await createCourse();
    const name = faker.random.word();
    await request(app.getHttpServer())
      .post("/student-classes")
      .send({
        courseId: course.id,
        name,
        year: 2022,
      })
      .expect(201);

    const result = await StudentClassModel.findAll();
    expect(result).toBeDefined();
    expect(result?.length).toBe(1);
    expect(result?.[0].name).toBe(name);
    expect(result?.[0].year).toBe(2022);
  });

  it(`/POST student-classes with bad request`, () => {
    return request(app.getHttpServer())
      .post("/student-classes")
      .send({
        name: faker.random.word(),
      })
      .then((result) => {
        expect(result.statusCode).toEqual(400);
        expect(result._body.message).toEqual(Messages.MISSING_COURSE_ID);
      });
  });

  it(`/PUT student-classes`, async () => {
    const course = await createCourse();
    const student = await createStudent();
    const teacher = await createTeacher();
    const studentClass = await StudentClassModel.create({
      id: uuid(),
      courseId: course.id,
      name: faker.random.word(),
      active: true,
    });
    const newName = faker.random.word();

    const response = await request(app.getHttpServer())
      .put(`/student-classes/${studentClass.id}`)
      .send({
        name: newName,
        active: true,
        year: 2022,
        students: [
          {
            studentId: student.id,
            action: "A",
          },
        ],
        teachers: [
          {
            teacherId: teacher.id,
            action: "A",
          },
        ],
      });

    const body: StudentClassDto = response._body.body;
    expect(body.teachers.find((t) => t.id === teacher.id)).toBeDefined();
    expect(body.students.find((s) => s.id === student.id)).toBeDefined();

    const result = await StudentClassModel.findOne({
      where: { id: studentClass.id },
      include: ["teachers", "enrollments"],
    });
    expect(result).toBeDefined();
    expect(result?.name).toBe(newName);
    expect(result?.year).toBe(2022);
    expect(result?.teachers.length).toBe(1);
    expect(result?.enrollments.length).toBe(1);
  });

  it(`404 /PUT student-classes with invalid student class`, async () => {
    await request(app.getHttpServer())
      .put(`/student-classes/${uuid()}`)
      .send({
        name: faker.random.word(),
        active: false,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(result._body.message).toEqual(Messages.INVALID_STUDENT_CLASS);
      });
  });

  it(`/GET student class by ID`, async () => {
    const course = await createCourse();
    const studentClass = await StudentClassModel.create({
      id: uuid(),
      courseId: course.id,
      name: faker.random.word(),
      active: true,
    });
    const response = await request(app.getHttpServer()).get(
      `/student-classes/${studentClass.id}`
    );

    expect(response.statusCode).toBe(200);
    const body: StudentClassDto = response._body.body;
    expect(body.id).toBe(studentClass.id);
  });

  it(`/DELETE student class by ID`, async () => {
    const course = await createCourse();
    const studentClass = await StudentClassModel.create({
      id: uuid(),
      courseId: course.id,
      name: faker.random.word(),
      active: true,
    });
    await request(app.getHttpServer())
      .delete(`/student-classes/${studentClass.id}`)
      .then((result) => {
        expect(result.statusCode).toEqual(204);
      });

    const exists = await StudentClassModel.findOne({
      where: { id: studentClass.id },
    });
    expect(exists).toBeNull();
  });

  it(`/DELETE student class with invalid class`, async () => {
    await request(app.getHttpServer())
      .delete(`/student-classes/${uuid()}`)
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(result._body.message).toEqual(Messages.INVALID_STUDENT_CLASS);
      });
  });

  it(`/POST student-classes/search`, async () => {
    const course = await createCourse();
    const studentClass = await StudentClassModel.create({
      id: uuid(),
      courseId: course.id,
      name: faker.random.word(),
      active: true,
    });
    await StudentClassModel.create({
      id: uuid(),
      courseId: course.id,
      name: faker.random.word(),
      active: true,
    });
    await request(app.getHttpServer())
      .post("/student-classes/search")
      .send({
        name: studentClass.name,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result._body?.body?.data?.length).toEqual(1);
        expect(result._body.body.data[0]?.id).toEqual(studentClass.id);
      });
  });

  it(`/GET student attendances`, async () => {
    const { studentClass, student2 } = await makeClassRegistries();

    const response = await request(app.getHttpServer()).get(
      `/student-classes/${studentClass.id}/students/${student2.id}`
    );

    expect(response.statusCode).toBe(200);
    const body: StudentAttendancesDto = response._body.body;
    expect(body.student).toBeDefined();
    expect(body.student?.id).toBe(student2.id);
    expect(body.student?.name).toBe(student2.name);
    expect(body.student?.active).toBe(student2.active);
    expect(body.studentClass).toBeDefined();
    expect(body.studentClass?.id).toBe(studentClass.id);
    expect(body.studentClass?.name).toBe(studentClass.name);
    expect(body.studentClass?.year).toBe(studentClass.year);
    expect(body.studentClass?.active).toBe(studentClass.active);
    expect(body.lessons.length).toBe(2);
  });
});

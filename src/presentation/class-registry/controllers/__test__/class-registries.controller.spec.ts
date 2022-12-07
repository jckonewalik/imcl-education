import { DateUtils } from "@/domain/@shared/util/date-utils";
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
import { ClassRegistriesModule } from "@/modules/class-registries.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { v4 as uuid } from "uuid";
import { ClassRegistryDto } from "../../dto";

const makeClassRegistry = async () => {
  const { course, studentClass, teacher1, teacher2, student1, student2 } =
    await makeModels();

  const id = uuid();
  const registry = await ClassRegistryModel.create({
    id,
    studentClassId: studentClass.id,
    teacherId: teacher1.id,
    date: new Date(),
  });
  await ClassRegistryStudentModel.create({
    studentId: student1.id,
    classRegistryId: id,
  });
  await ClassRegistryLessonModel.create({
    classRegistryId: id,
    lessonId: course.lessons[0].id,
  });
  return {
    course,
    studentClass,
    teacher1,
    teacher2,
    student1,
    student2,
    registry,
  };
};
describe("Class Registries Controller Tests", () => {
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
          StudentClassModel,
          CourseModel,
          EnrollmentModel,
          StudentClassTeacherModel,
          TeacherModel,
          LessonModel,
          StudentModel,
          ClassRegistryModel,
          ClassRegistryStudentModel,
          ClassRegistryLessonModel,
        ]);
        await sequelize.sync();
      },
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [...databaseProviders],
      imports: [ClassRegistriesModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it(`/POST class-registries`, async () => {
    const { course, student1, studentClass, teacher1 } = await makeModels();
    const response = await request(app.getHttpServer())
      .post("/class-registries")
      .send({
        studentClassId: studentClass.id,
        teacherId: teacher1.id,
        date: DateUtils.toIsoDate(new Date()),
        studentIds: [student1.id],
        lessonIds: [course.lessons[0]?.id],
      });

    expect(response.statusCode).toBe(201);
    const result = await ClassRegistryModel.findOne({
      include: ["lessons", "students"],
    });
    expect(result).toBeDefined();
    expect(result?.studentClassId).toBe(studentClass.id);
    expect(result?.teacherId).toBe(teacher1.id);
    expect(result?.date).toBe(DateUtils.toIsoDate(new Date()));
    expect(result?.lessons.length).toBe(1);
    expect(result?.lessons[0].id).toBe(course.lessons[0].id);
    expect(result?.students.length).toBe(1);
    expect(result?.students[0].id).toBe(student1.id);
  });

  it(`/POST class-registries with bad request`, () => {
    return request(app.getHttpServer())
      .post("/class-registries")
      .send({
        date: DateUtils.toSimpleDate(new Date()),
        teacherId: uuid(),
      })
      .then((result) => {
        expect(result.statusCode).toEqual(400);
        expect(result._body.message).toEqual(Messages.MISSING_STUDENT_CLASS_ID);
      });
  });

  it(`/PUT class-registries`, async () => {
    const { teacher2, student1, student2, registry } =
      await makeClassRegistry();

    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);

    const response = await request(app.getHttpServer())
      .put(`/class-registries/${registry.id}`)
      .send({
        date: newDate,
        teacherId: teacher2.id,
        students: [
          {
            studentId: student2.id,
            action: "A",
          },
        ],
      });

    expect(response.statusCode).toBe(200);

    const body: ClassRegistryDto = response._body.body;
    expect(body.students.find((t) => t.id === student2.id)).toBeDefined();
    expect(body.students.find((s) => s.id === student1.id)).toBeDefined();

    const result = await ClassRegistryModel.findOne({
      where: { id: registry.id },
      include: ["students", "lessons"],
    });
    expect(result).toBeDefined();
    expect(DateUtils.toSimpleDate(result!.date)).toStrictEqual(
      DateUtils.toSimpleDate(newDate)
    );
    expect(result?.teacherId).toBe(teacher2.id);
    expect(result?.students.length).toBe(2);
    expect(result?.lessons.length).toBe(1);
  });

  it(`404 /PUT class-registries with invalid registry`, async () => {
    await request(app.getHttpServer())
      .put(`/class-registries/${uuid()}`)
      .send({
        date: new Date(),
        teacherId: uuid(),
        students: [],
      })
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(result._body.message).toEqual(Messages.INVALID_CLASS_REGISTRY);
      });
  });

  it(`/DELETE class registry by ID`, async () => {
    const { registry } = await makeClassRegistry();

    await request(app.getHttpServer())
      .delete(`/class-registries/${registry.id}`)
      .then((result) => {
        expect(result.statusCode).toEqual(204);
      });

    const exists = await ClassRegistryModel.findOne({
      where: { id: registry.id },
    });
    expect(exists).toBeNull();
  });

  it(`/DELETE class registry with invalid registry`, async () => {
    await request(app.getHttpServer())
      .delete(`/class-registries/${uuid()}`)
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(result._body.message).toEqual(Messages.INVALID_CLASS_REGISTRY);
      });
  });
});

import { makeJwtToken } from "@/__test__/@shared/util";
import { Gender } from "@/domain/@shared/enums/gender";
import Messages from "@/domain/@shared/util/messages";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { StudentsModule } from "@/modules/students.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { v4 as uuid } from "uuid";
describe("Students Controller Tests", () => {
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
          StudentModel,
          EnrollmentModel,
          StudentClassModel,
          CourseModel,
          StudentClassTeacherModel,
          TeacherModel,
          LessonModel,
        ]);
        await sequelize.sync();
      },
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [...databaseProviders],
      imports: [StudentsModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it(`/POST students`, async () => {
    const { studentClass } = await makeEntities();
    const name = faker.random.word();
    await request(app.getHttpServer())
      .post("/students")
      .set({
        Authorization: `Bearer ${makeJwtToken({})}`,
      })
      .send({
        name,
        gender: "M",
        studentClassId: studentClass.id
      })
      .expect(201);

    const result = await StudentModel.findAll();
    expect(result).toBeDefined();
    expect(result?.length).toBe(1);
    expect(result?.[0].name).toBe(name);
  });

  it(`/POST students with bad request`, () => {
    const name = faker.random.word();
    return request(app.getHttpServer())
      .post("/students")
      .set({
        Authorization: `Bearer ${makeJwtToken({})}`,
      })
      .send({
        name,
        gender: "X",
      })
      .then((result) => {
        expect(result.statusCode).toEqual(400);
        expect(result._body.message).toEqual(Messages.INVALID_GENDER);
      });
  });

  it(`/PUT students`, async () => {
    const { studentClass } = await makeEntities()
    const student = await StudentModel.create({
      id: uuid(),
      studentClassId: studentClass.id,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      gender: Gender.M.toString(),
      active: true,
    });
    const phoneNumber = "99999999999";
    await request(app.getHttpServer())
      .put(`/students/${student.id}`)
      .set({
        Authorization: `Bearer ${makeJwtToken({})}`,
      })
      .send({
        name: student.name,
        active: false,
        phone: {
          number: phoneNumber,
          isWhatsapp: true,
        },
      })
      .expect(200);

    const result = await StudentModel.findOne({ where: { id: student.id } });
    expect(result).toBeDefined();
    expect(result?.phoneNumber).toBe(phoneNumber);
    expect(result?.phoneIsWhatsapp).toBeTruthy();
  });

  it(`/PUT students with invalid student`, async () => {
    await request(app.getHttpServer())
      .put(`/students/${uuid()}`)
      .set({
        Authorization: `Bearer ${makeJwtToken({})}`,
      })
      .send({
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        active: false,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(result._body.message).toEqual(Messages.INVALID_STUDENT);
      });
  });

  it(`/GET students by ID`, async () => {
    const { studentClass } = await makeEntities()
    const student = await StudentModel.create({
      id: uuid(),
      studentClassId: studentClass.id,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      gender: Gender.M.toString(),
      phoneNumber: "99999999999",
      phoneIsWhatsapp: true,
      active: true,
    });
    await request(app.getHttpServer())
      .get(`/students/${student.id}`)
      .set({
        Authorization: `Bearer ${makeJwtToken({})}`,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result._body.body.id).toEqual(student.id);
        expect(result._body.body.name).toEqual(student.name);
        expect(result._body.body.gender).toEqual(student.gender);
        expect(result._body.body.active).toEqual(student.active);
        expect(result._body.body.phone.number).toEqual(student.phoneNumber);
        expect(result._body.body.phone.isWhatsapp).toEqual(
          student.phoneIsWhatsapp
        );
      });
  });

  it(`/POST students/search`, async () => {
    const { studentClass } = await makeEntities();
    const student1 = await StudentModel.create({
      id: uuid(),
      studentClassId: studentClass.id,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      gender: Gender.M.toString(),
      active: true,
    });
    await StudentModel.create({
      id: uuid(),
      studentClassId: studentClass.id,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      active: true,
    });

    await request(app.getHttpServer())
      .post("/students/search")
      .set({
        Authorization: `Bearer ${makeJwtToken({})}`,
      })
      .send({
        name: student1.name,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result._body?.body?.data?.length).toEqual(1);
        expect(result._body.body.data[0]?.id).toEqual(student1.id);
      });
  });

  it(`/DELETE students by ID`, async () => {
    const { studentClass } = await makeEntities()
    const student = await StudentModel.create({
      id: uuid(),
      studentClassId: studentClass.id,
      name: faker.random.word(),
      active: true,
    });
    await request(app.getHttpServer())
      .delete(`/students/${student.id}`)
      .set({
        Authorization: `Bearer ${makeJwtToken({})}`,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(204);
      });

    const exists = await StudentModel.findOne({ where: { id: student.id } });
    expect(exists).toBeNull();
  });

  it(`/DELETE students with invalid student`, async () => {
    await request(app.getHttpServer())
      .delete(`/students/${uuid()}`)
      .set({
        Authorization: `Bearer ${makeJwtToken({})}`,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(result._body.message).toEqual(Messages.INVALID_STUDENT);
      });
  });
});

const makeEntities = async (): Promise<{ course: CourseModel, studentClass: StudentClassModel }> => {
  const course = await CourseModel.create({
    id: uuid(),
    name: faker.name.firstName(),
    active: true
  })
  const studentClass = await StudentClassModel.create({
    id: uuid(),
    name: faker.name.firstName(),
    courseId: course.id,
    year: faker.datatype.number(),
    active: true,
  })
  return { course, studentClass }
}
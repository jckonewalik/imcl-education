import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "@/domain/student-class/entity";
import { FindInStudentClassesRepository } from "@/domain/student-class/repository";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import { CourseModel, LessonModel } from "../../../course/model";
import { TeacherModel } from "../../../teacher/model";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "../../model";
import { SequelizeFindInStudentClassesRepository } from "../find-in-student-classes.repository";
import { makeModels } from "./util";
type Sut = {
  studentClasses: StudentClass[];
  sut: FindInStudentClassesRepository;
};
const makeSut = async (): Promise<Sut> => {
  const { course: course1 } = await makeModels();
  const { course: course2 } = await makeModels();

  const studentClass1 = await StudentClassModel.create({
    id: uuid(),
    courseId: course1.id,
    name: "1 Student Class",
    year: 2022,
    active: false,
  });
  const studentClass2 = await StudentClassModel.create({
    id: uuid(),
    courseId: course1.id,
    name: "2 Student Class",
    year: 2021,
    active: true,
  });
  const studentClass3 = await StudentClassModel.create({
    id: uuid(),
    courseId: course2.id,
    name: "3 Student Class",
    year: 2023,
    active: true,
  });

  const repository = new SequelizeFindInStudentClassesRepository();

  return {
    studentClasses: [
      studentClass1.toEntity(),
      studentClass2.toEntity(),
      studentClass3.toEntity(),
    ],
    sut: repository,
  };
};
describe("Sequelize Find In Student Classes Repository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CourseModel,
      LessonModel,
      EnrollmentModel,
      StudentClassTeacherModel,
      TeacherModel,
      StudentModel,
      StudentClassModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Fail trying find student classes passing a wrong ID", async () => {
    const { sut } = await makeSut();
    const t = async () => {
      await sut.find([faker.random.word()]);
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });

  it("Find student classes", async () => {
    const { sut, studentClasses } = await makeSut();

    const foundStudentClassess = await sut.find([
      studentClasses[0].id,
      studentClasses[1].id,
    ]);

    expect(foundStudentClassess.length).toBe(2);
    expect(
      foundStudentClassess.find((t) => t.id === studentClasses[0].id)
    ).toStrictEqual(studentClasses[0]);
    expect(
      foundStudentClassess.find((t) => t.id === studentClasses[1].id)
    ).toStrictEqual(studentClasses[1]);
  });
});

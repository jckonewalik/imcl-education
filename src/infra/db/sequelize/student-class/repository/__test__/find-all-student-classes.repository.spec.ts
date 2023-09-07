import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "@/domain/student-class/entity";
import { FindAllStudentClassesRepository } from "@/domain/student-class/repository";
import {
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import { CourseModel, LessonModel } from "../../../course/model";
import { StudentModel } from "../../../student/model";
import { TeacherModel } from "../../../teacher/model";
import { SequelizeFindAllStudentClassesRepository } from "../find-all-student-classes.repository";
import { makeModels } from "./util";
type Sut = {
  studentClasses: StudentClass[];
  sut: FindAllStudentClassesRepository;
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

  const repository = new SequelizeFindAllStudentClassesRepository();

  return {
    studentClasses: [
      studentClass1.toEntity(),
      studentClass2.toEntity(),
      studentClass3.toEntity(),
    ],
    sut: repository,
  };
};
describe("Sequelize Find All Student Classes Repository", () => {
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

  it("Find student class by name", async () => {
    const { studentClasses, sut } = await makeSut();
    const result = await sut.find(
      { name: studentClasses[0].name.substring(0, 5) },
      "name",
      "ASC",
      1,
      1
    );

    expect(result.currentPage).toBe(1);
    expect(result.totalItems).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.data[0]).toStrictEqual(studentClasses[0]);
  });

  it("Find student classes by course", async () => {
    const { studentClasses, sut } = await makeSut();
    const result = await sut.find(
      { courseId: studentClasses[0].courseId },
      "name",
      "ASC",
      1,
      2
    );

    expect(result.currentPage).toBe(2);
    expect(result.totalItems).toBe(2);
    expect(result.totalPages).toBe(2);
    expect(result.data[0]).toStrictEqual(studentClasses[1]);
  });
  it("Fail finding student classes with invalid course ID", async () => {
    const { studentClasses, sut } = await makeSut();
    const t = async () =>
      await sut.find({ courseId: faker.random.word() }, "name", "ASC", 1, 2);

    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });
  it("Find active student classes", async () => {
    const { studentClasses, sut } = await makeSut();
    const result = await sut.find({ active: true }, "name", "ASC", 2, 1);

    expect(result.currentPage).toBe(1);
    expect(result.totalItems).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(result.data[0]).toStrictEqual(studentClasses[1]);
  });
  it("Find student classes by year", async () => {
    const { studentClasses, sut } = await makeSut();
    const result = await sut.find(
      { year: studentClasses[2].year },
      "name",
      "ASC",
      1,
      1
    );

    expect(result.currentPage).toBe(1);
    expect(result.totalItems).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.data[0]).toStrictEqual(studentClasses[2]);
  });
});

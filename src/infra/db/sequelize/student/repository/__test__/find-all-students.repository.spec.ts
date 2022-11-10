import { Gender } from "@/domain/@shared/enums/gender";
import { Student } from "@/domain/student/entity";
import { FindAllStudentsRepository } from "@/domain/student/repository";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { Sequelize } from "sequelize-typescript";
import { SequelizeFindAllStudentsRepository } from "../find-all-students.repository";
import { makeStudent } from "./util";

type Sut = {
  students: Student[];
  sut: FindAllStudentsRepository;
};

const makeSut = async (): Promise<Sut> => {
  const student1 = makeStudent({ active: false });
  const student2 = makeStudent({ gender: Gender.F });
  const student3 = makeStudent({});

  await StudentModel.create({
    id: student1.id,
    name: student1.name,
    gender: student1.gender.toString(),
    active: student1.active,
    phoneNumber: student1.phone?.number,
    phoneIsWhatsapp: student1.phone?.isWhatsapp,
  });
  await StudentModel.create({
    id: student2.id,
    name: student2.name,
    gender: student2.gender.toString(),
    active: student2.active,
    phoneNumber: student1.phone?.number,
    phoneIsWhatsapp: student1.phone?.isWhatsapp,
  });
  await StudentModel.create({
    id: student3.id,
    name: student3.name,
    gender: student3.gender.toString(),
    active: student3.active,
    phoneNumber: student1.phone?.number,
    phoneIsWhatsapp: student1.phone?.isWhatsapp,
  });

  const repository = new SequelizeFindAllStudentsRepository();

  return { students: [student1, student2, student3], sut: repository };
};
describe("Sequelize Find All Students Repository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([StudentModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Find student by name", async () => {
    const { students, sut } = await makeSut();
    const result = await sut.find(
      { name: students[0].name.substring(0, 5) },
      1,
      1
    );

    expect(result.currentPage).toBe(1);
    expect(result.totalItems).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.data[0]).toStrictEqual(students[0]);
  });

  it("Find student by gender", async () => {
    const { students, sut } = await makeSut();
    const result = await sut.find({ gender: Gender.M.toString() }, 1, 2);

    expect(result.currentPage).toBe(2);
    expect(result.totalItems).toBe(2);
    expect(result.totalPages).toBe(2);
    expect(result.data[0]).toStrictEqual(students[2]);
  });
  it("Find active students", async () => {
    const { students, sut } = await makeSut();
    const result = await sut.find({ active: true }, 2, 1);

    expect(result.currentPage).toBe(1);
    expect(result.totalItems).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(result.data[0]).toStrictEqual(students[1]);
  });
});

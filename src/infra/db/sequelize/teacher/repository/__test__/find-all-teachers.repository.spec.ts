import { Gender } from "@/domain/@shared/enums/gender";
import { Teacher } from "@/domain/teacher/entity";
import { FindAllTeachersRepository } from "@/domain/teacher/repository";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { Sequelize } from "sequelize-typescript";
import { SequelizeFindAllTeachersRepository } from "../find-all-teachers.repository";
import { makeTeacher } from "./util";

type Sut = {
  teachers: Teacher[];
  sut: FindAllTeachersRepository;
};

const makeSut = async (): Promise<Sut> => {
  const teacher1 = makeTeacher({ active: false });
  const teacher2 = makeTeacher({ gender: Gender.F });
  const teacher3 = makeTeacher({});

  await TeacherModel.create({
    id: teacher1.id,
    name: teacher1.name,
    gender: teacher1.gender.toString(),
    email: teacher1.email.value,
    active: teacher1.active,
  });
  await TeacherModel.create({
    id: teacher2.id,
    name: teacher2.name,
    gender: teacher2.gender.toString(),
    email: teacher2.email.value,
    active: teacher2.active,
  });
  await TeacherModel.create({
    id: teacher3.id,
    name: teacher3.name,
    gender: teacher3.gender.toString(),
    email: teacher3.email.value,
    active: teacher3.active,
  });

  const repository = new SequelizeFindAllTeachersRepository();

  return { teachers: [teacher1, teacher2, teacher3], sut: repository };
};
describe("Sequelize Find All Teachers Repository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([TeacherModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Find teacher by name", async () => {
    const { teachers, sut } = await makeSut();
    const result = await sut.find(
      { name: teachers[0].name.substring(0, 5) },
      1,
      0
    );

    expect(result.currentPage).toBe(1);
    expect(result.totalItems).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.data[0]).toStrictEqual(teachers[0]);
  });

  it("Find teacher by gender", async () => {
    const { teachers, sut } = await makeSut();
    const result = await sut.find({ gender: Gender.M.toString() }, 1, 1);

    expect(result.currentPage).toBe(2);
    expect(result.totalItems).toBe(2);
    expect(result.totalPages).toBe(2);
    expect(result.data[0]).toStrictEqual(teachers[2]);
  });
  it("Find active teachers", async () => {
    const { teachers, sut } = await makeSut();
    const result = await sut.find({ active: true }, 2, 0);

    expect(result.currentPage).toBe(1);
    expect(result.totalItems).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(result.data[0]).toStrictEqual(teachers[1]);
  });
  it("Find teacher by email", async () => {
    const { teachers, sut } = await makeSut();
    const result = await sut.find({ email: teachers[0].email.value }, 1, 0);

    expect(result.currentPage).toBe(1);
    expect(result.totalItems).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.data[0]).toStrictEqual(teachers[0]);
  });
});

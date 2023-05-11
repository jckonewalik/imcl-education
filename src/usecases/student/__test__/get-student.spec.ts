import { Gender } from "@/domain/@shared/enums/gender";
import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Student } from "@/domain/student/entity";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { GetStudentUseCase } from "../get-student";

type SutsProps = {
  students?: Map<string, Student>;
};

type Suts = {
  sut: GetStudentUseCase;
};

const makeStudents = () => {
  const student1 = new Student({
    id: uuid(),
    name: faker.name.firstName(),
    gender: Gender.F,
    active: true,
  });
  const student2 = new Student({
    id: uuid(),
    name: faker.name.firstName(),
    gender: Gender.F,
    active: true,
  });

  const studentsMap = new Map<string, Student>();
  studentsMap.set(student1.id, student1);
  studentsMap.set(student2.id, student2);

  return { student1, student2, studentsMap };
};

const makeSuts = ({ students }: SutsProps): Suts => {
  const repository = {
    find: async (id: string) => {
      return students?.get(id);
    },
  };
  const sut = new GetStudentUseCase(repository);
  return { sut };
};

describe("Get Student Use Case", () => {
  it("Get a student by ID", async () => {
    const { student1, studentsMap } = makeStudents();
    const { sut } = makeSuts({ students: studentsMap });

    const result = await sut.get(student1.id);

    expect(result.id).toBe(student1.id);
    expect(result.name).toBe(student1.name);
    expect(result.gender).toBe(student1.gender);
    expect(result.active).toBe(student1.active);
  });

  it("Fail getting a invalid student", async () => {
    const { sut } = makeSuts({});

    const t = async () => {
      await sut.get(uuid());
    };

    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_STUDENT);
  });
});

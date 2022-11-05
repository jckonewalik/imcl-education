import { Gender } from "@/domain/@shared/enums/gender";
import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { Teacher } from "@/domain/teacher/entity";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { GetTeacherUseCase } from "../get-teacher";

type SutsProps = {
  teachers?: Map<string, Teacher>;
};

type Suts = {
  sut: GetTeacherUseCase;
};

const makeTeachers = () => {
  const teacher1 = new Teacher(
    uuid(),
    faker.name.firstName(),
    Gender.F,
    new Email(faker.internet.email()),
    true
  );
  const teacher2 = new Teacher(
    uuid(),
    faker.name.firstName(),
    Gender.F,
    new Email(faker.internet.email()),
    true
  );

  const teachersMap = new Map<string, Teacher>();
  teachersMap.set(teacher1.id, teacher1);
  teachersMap.set(teacher2.id, teacher2);

  return { teacher1, teacher2, teachersMap };
};

const makeSuts = ({ teachers }: SutsProps): Suts => {
  const repository = {
    find: async (id: string) => {
      return teachers?.get(id);
    },
  };
  const sut = new GetTeacherUseCase(repository);
  return { sut };
};

describe("Get Teacher Use Case", () => {
  it("Get a teacher by ID", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const { sut } = makeSuts({ teachers: teachersMap });

    const result = await sut.get(teacher1.id);

    expect(result.id).toBe(teacher1.id);
    expect(result.name).toBe(teacher1.name);
    expect(result.gender).toBe(teacher1.gender);
    expect(result.email).toBe(teacher1.email);
    expect(result.active).toBe(teacher1.active);
  });

  it("Fail getting a invalid teacher", async () => {
    const { sut } = makeSuts({});

    const t = async () => {
      await sut.get(uuid());
    };

    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_TEACHER);
  });
});

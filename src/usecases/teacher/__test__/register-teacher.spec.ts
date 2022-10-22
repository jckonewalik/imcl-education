import { Gender } from "@/domain/@shared/enums/gender";
import { Email } from "@/domain/@shared/value-objects";
import { Teacher } from "@/domain/teacher/entity";
import { CreateTeacherRepository } from "@/domain/teacher/repository/teacher.repository";
import faker from "faker";
import { RegisterTeacherUseCase } from "../register-teacher";
import { v4 as uuid } from "uuid";
import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";

type SutsProps = {
  teachers?: Map<string, Teacher>;
};

type Suts = {
  createRepository: CreateTeacherRepository;
  sut: RegisterTeacherUseCase;
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
  teachersMap.set(teacher1.email.value, teacher1);
  teachersMap.set(teacher2.email.value, teacher2);

  return { teacher1, teacher2, teachersMap };
};

const makeSuts = ({ teachers }: SutsProps): Suts => {
  const repository = {
    create: async (teacher: Teacher) => {},
  };
  const findByEmailRepo = {
    find: async (email: Email): Promise<Teacher | undefined> => {
      return teachers?.get(email.value);
    },
  };
  const sut = new RegisterTeacherUseCase(repository, findByEmailRepo);
  return { createRepository: repository, sut };
};

describe("Register Teacher Use Case", () => {
  it("Register a new teacher", async () => {
    const { createRepository, sut } = makeSuts({});
    const spyCreate = jest.spyOn(createRepository, "create");

    const dto = {
      name: faker.name.firstName(),
      gender: Gender.F,
      email: faker.internet.email(),
    };
    const result = await sut.register(dto);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(dto.name);
    expect(result.gender).toBe(dto.gender);
    expect(result.email.value).toBe(dto.email);
    expect(result.active).toBe(true);
    expect(spyCreate).toHaveBeenCalledWith(result);
  });

  it("Fail registering a new teacher using an existing email", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const { sut } = makeSuts({ teachers: teachersMap });

    const dto = {
      name: faker.name.firstName(),
      gender: Gender.F,
      email: teacher1.email.value,
    };

    const t = async () => {
      await sut.register(dto);
    };

    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.TEACHER_EMAIL_ALREADY_IN_USE);
  });
});

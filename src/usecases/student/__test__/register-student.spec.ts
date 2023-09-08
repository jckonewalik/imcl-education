import { Student } from "@/domain/student/entity/student";
import { CreateStudentRepository } from "@/domain/student/repository";
import { RegisterStudentUseCase } from "../register-student";
import faker from "faker";
import { Gender } from "@/domain/@shared/enums/gender";
import { StudentClassModel } from "@/infra/db/sequelize/student-class/model";
import { StudentClass } from "@/domain/student-class/entity";
import { EntityNotFoundException, InvalidValueException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
type Suts = {
  createRepository: CreateStudentRepository;
  sut: RegisterStudentUseCase;
};

const makeSuts = ({ studentClass }): Suts => {
  const repository = {
    create: async (student: Student) => { },
  };
  const findStudentClassRepository = {
    find: async (id: string): Promise<StudentClass> => {
      return Promise.resolve(studentClass)
    }
  }
  const sut = new RegisterStudentUseCase(repository, findStudentClassRepository);
  return { createRepository: repository, sut };
};

describe("Register Student Use Case", () => {
  it("Register a new student", async () => {
    const studentClass = StudentClass.Builder.builder(faker.datatype.uuid(), faker.datatype.uuid(), faker.name.firstName(), true).build()
    const { createRepository, sut } = makeSuts({ studentClass });
    const spyCreate = jest.spyOn(createRepository, "create");

    const dto = {
      name: faker.name.firstName(),
      gender: Gender.F,
      phone: {
        number: "9999999999",
        isWhatsapp: true,
      },
      studentClassId: faker.datatype.uuid()
    };
    const result = await sut.register(dto);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(dto.name);
    expect(result.gender).toBe(dto.gender);
    expect(result.phone?.number).toBe(dto.phone.number);
    expect(result.phone?.isWhatsapp).toBe(dto.phone.isWhatsapp);
    expect(result.active).toBe(true);
    expect(spyCreate).toHaveBeenCalledWith(result);
  });

  it("Fail registering a new student with invalid student class", async () => {
    const { sut } = makeSuts({ studentClass: undefined });

    const dto = {
      name: faker.name.firstName(),
      gender: Gender.F,
      phone: {
        number: "9999999999",
        isWhatsapp: true,
      },
      studentClassId: faker.datatype.uuid()
    };
    const t = async () => { await sut.register(dto) };

    expect(t).rejects.toThrow(EntityNotFoundException);
    expect(t).rejects.toThrow(Messages.INVALID_STUDENT_CLASS);
  });

  it("Fail registering a new student with an inactive student class", async () => {
    const studentClass = StudentClass.Builder.builder(faker.datatype.uuid(), faker.datatype.uuid(), faker.name.firstName(), false).build()
    const { sut } = makeSuts({ studentClass: studentClass });

    const dto = {
      name: faker.name.firstName(),
      gender: Gender.F,
      phone: {
        number: "9999999999",
        isWhatsapp: true,
      },
      studentClassId: faker.datatype.uuid()
    };
    const t = async () => { await sut.register(dto) };

    expect(t).rejects.toThrow(InvalidValueException);
    expect(t).rejects.toThrow(Messages.REQUIRES_ACTIVE_STUDENT_CLASS);
  });
});

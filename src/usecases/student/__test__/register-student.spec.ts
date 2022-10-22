import { Student } from "@/domain/student/entity/student";
import { CreateStudentRepository } from "@/domain/student/repository";
import { RegisterStudentUseCase } from "../register-student";
import faker from "faker";
import { Gender } from "@/domain/@shared/enums/gender";
type Suts = {
  createRepository: CreateStudentRepository;
  sut: RegisterStudentUseCase;
};

const makeSuts = (): Suts => {
  const repository = {
    create: async (student: Student) => {},
  };
  const sut = new RegisterStudentUseCase(repository);
  return { createRepository: repository, sut };
};

describe("Register Student Use Case", () => {
  it("Register a new student", async () => {
    const { createRepository, sut } = makeSuts();
    const spyCreate = jest.spyOn(createRepository, "create");

    const dto = {
      name: faker.name.firstName(),
      gender: Gender.F,
      phone: {
        number: "9999999999",
        isWhatsapp: true,
      },
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
});

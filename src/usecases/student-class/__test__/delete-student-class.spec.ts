import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Course } from "@/domain/course/entity";
import { StudentClass } from "@/domain/student-class/entity";
import { DeleteStudentClassRepository } from "@/domain/student-class/repository";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { DeleteStudentClassUseCase } from "../delete-student-class";

type SutsProps = {
  studentClasss?: Map<string, StudentClass>;
};

type Suts = {
  deleteRepo: DeleteStudentClassRepository;
  sut: DeleteStudentClassUseCase;
};

const makeStudentClasss = () => {
  const course = new Course(uuid(), faker.random.word(), true);
  const studentClass1 = StudentClass.Builder.builder(
    uuid(),
    course.id,
    faker.random.word(),
    true
  ).build();
  const studentClass2 = StudentClass.Builder.builder(
    uuid(),
    course.id,
    faker.random.word(),
    true
  ).build();

  const studentClasssMap = new Map<string, StudentClass>();
  studentClasssMap.set(studentClass1.id, studentClass1);
  studentClasssMap.set(studentClass2.id, studentClass2);

  return { studentClass1, studentClass2, studentClasssMap };
};

const makeSuts = ({ studentClasss }: SutsProps): Suts => {
  const findRepo = {
    find: async (id: string) => {
      return studentClasss?.get(id);
    },
  };
  const deleteRepo = {
    delete: async (id: string) => {},
  };
  const sut = new DeleteStudentClassUseCase(findRepo, deleteRepo);
  return { deleteRepo, sut };
};

describe("Delete Student Class Use Case", () => {
  it("Delete a student class by ID", async () => {
    const { studentClass1, studentClasssMap } = makeStudentClasss();
    const { deleteRepo, sut } = makeSuts({ studentClasss: studentClasssMap });
    const spyDelete = jest.spyOn(deleteRepo, "delete");

    await sut.delete(studentClass1.id);

    expect(spyDelete).toHaveBeenCalledWith(studentClass1.id);
  });

  it("Fail deleting a invalid student class", async () => {
    const { sut } = makeSuts({});

    const t = async () => {
      await sut.delete(uuid());
    };

    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_STUDENT_CLASS);
  });
});

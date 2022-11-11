import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Student } from "@/domain/student/entity";
import { DeleteStudentRepository } from "@/domain/student/repository";
import { makeStudent } from "@/infra/db/sequelize/student/repository/__test__/util";
import { v4 as uuid } from "uuid";
import { DeleteStudentUseCase } from "../delete-student";

type SutsProps = {
  students?: Map<string, Student>;
};

type Suts = {
  deleteRepo: DeleteStudentRepository;
  sut: DeleteStudentUseCase;
};

const makeStudents = () => {
  const student1 = makeStudent({});
  const student2 = makeStudent({});

  const studentsMap = new Map<string, Student>();
  studentsMap.set(student1.id, student1);
  studentsMap.set(student2.id, student2);

  return { student1, student2, studentsMap };
};

const makeSuts = ({ students }: SutsProps): Suts => {
  const findRepo = {
    find: async (id: string) => {
      return students?.get(id);
    },
  };
  const deleteRepo = {
    delete: async (id: string) => {},
  };
  const sut = new DeleteStudentUseCase(findRepo, deleteRepo);
  return { deleteRepo, sut };
};

describe("Delete Student Use Case", () => {
  it("Delete a student by ID", async () => {
    const { student1, studentsMap } = makeStudents();
    const { deleteRepo, sut } = makeSuts({ students: studentsMap });

    const spyDelete = jest.spyOn(deleteRepo, "delete");
    await sut.delete(student1.id);

    expect(spyDelete).toHaveBeenCalledWith(student1.id);
  });

  it("Fail deleting a invalid student", async () => {
    const { sut } = makeSuts({});

    const t = async () => {
      await sut.delete(uuid());
    };

    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_STUDENT);
  });
});

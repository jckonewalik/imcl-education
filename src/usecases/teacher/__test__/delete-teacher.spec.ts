import { Gender } from "@/domain/@shared/enums/gender";
import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { Teacher } from "@/domain/teacher/entity";
import { DeleteTeacherRepository } from "@/domain/teacher/repository";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { DeleteTeacherUseCase } from "../delete-teacher";

type SutsProps = {
  teachers?: Map<string, Teacher>;
};

type Suts = {
  deleteRepo: DeleteTeacherRepository;
  sut: DeleteTeacherUseCase;
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
  const findRepo = {
    find: async (id: string) => {
      return teachers?.get(id);
    },
  };
  const deleteRepo = {
    delete: async (id: string) => {},
  };
  const sut = new DeleteTeacherUseCase(findRepo, deleteRepo);
  return { deleteRepo, sut };
};

describe("Delete Teacher Use Case", () => {
  it("Delete a teacher by ID", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const { deleteRepo, sut } = makeSuts({ teachers: teachersMap });
    const spyDelete = jest.spyOn(deleteRepo, "delete");

    await sut.delete(teacher1.id);

    expect(spyDelete).toHaveBeenCalledWith(teacher1.id);
  });

  it("Fail deleting a invalid teacher", async () => {
    const { sut } = makeSuts({});

    const t = async () => {
      await sut.delete(uuid());
    };

    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_TEACHER);
  });
});

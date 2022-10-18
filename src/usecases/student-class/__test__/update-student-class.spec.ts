import { v4 as uuid } from "uuid";
import faker from "faker";
import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "@/domain/student-class/entity";
import { UpdateStudentClassUseCase } from "../update-student-class";
import { Course } from "@/domain/course/entity";
import StudentClassService from "@/domain/student-class/services/student-class.service";
import { UpdateStudentClassRepository } from "@/domain/student-class/repository";

type SutsProps = {
  studentClass?: StudentClass;
};
type Suts = {
  updateRepo: UpdateStudentClassRepository;
  sut: UpdateStudentClassUseCase;
};

const makeSuts = (props: SutsProps): Suts => {
  const findRepo = {
    async find(id: string): Promise<StudentClass | undefined> {
      return props.studentClass;
    },
  };
  const updateRepo = {
    async update(studentClass: StudentClass): Promise<void> {},
  };
  return {
    updateRepo,
    sut: new UpdateStudentClassUseCase(findRepo, updateRepo),
  };
};
describe("Update Student Class Use Case", () => {
  it("Fail updating invalid student class", async () => {
    const { sut } = makeSuts({ studentClass: undefined });
    const t = async () => {
      await sut.update({
        id: uuid(),
        name: faker.name.jobArea(),
      });
    };
    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_STUDENT_CLASS);
  });
  it("updating class changing class name", async () => {
    const course = new Course(uuid(), faker.name.jobArea(), true);
    const studentClass = StudentClassService.newStudentClass(
      course,
      faker.random.word()
    );

    const { updateRepo, sut } = makeSuts({ studentClass });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const newName = faker.random.word();
    const updatedClass = await sut.update({
      id: course.id,
      name: newName,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedClass);
    expect(updatedClass.name).toBe(newName);
  });
});

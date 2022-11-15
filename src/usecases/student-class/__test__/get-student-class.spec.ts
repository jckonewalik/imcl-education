import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Course } from "@/domain/course/entity";
import { StudentClass } from "@/domain/student-class/entity";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { GetStudentClassUseCase } from "../get-student-class";

type SutsProps = {
  classes?: Map<string, StudentClass>;
};

type Suts = {
  sut: GetStudentClassUseCase;
};

const makeStudentClasses = () => {
  const course = new Course(uuid(), faker.random.word(), true);
  const studentClass1 = StudentClass.Builder.builder(
    uuid(),
    course.id,
    faker.random.word()
  ).build();
  const studentClass2 = StudentClass.Builder.builder(
    uuid(),
    course.id,
    faker.random.word()
  ).build();

  const classesMap = new Map<string, StudentClass>();
  classesMap.set(studentClass1.id, studentClass1);
  classesMap.set(studentClass2.id, studentClass2);

  return { studentClass1, studentClass2, classesMap };
};

const makeSuts = ({ classes }: SutsProps): Suts => {
  const repository = {
    find: async (id: string) => {
      return classes?.get(id);
    },
  };
  const sut = new GetStudentClassUseCase(repository);
  return { sut };
};

describe("Get Student Use Case", () => {
  it("Get a student by ID", async () => {
    const { studentClass1, classesMap } = makeStudentClasses();
    const { sut } = makeSuts({ classes: classesMap });

    const result = await sut.get(studentClass1.id);

    expect(result.id).toBe(studentClass1.id);
    expect(result.name).toBe(studentClass1.name);
    expect(result.courseId).toBe(studentClass1.courseId);
    expect(result.active).toBe(studentClass1.active);
  });

  it("Fail getting a invalid student class", async () => {
    const { sut } = makeSuts({});

    const t = async () => {
      await sut.get(uuid());
    };

    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_STUDENT_CLASS);
  });
});

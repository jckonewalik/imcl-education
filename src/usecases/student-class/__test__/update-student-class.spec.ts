import { v4 as uuid } from "uuid";
import faker from "faker";
import {
  BadRequestException,
  EntityNotFoundException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "@/domain/student-class/entity";
import { UpdateStudentClassUseCase } from "../update-student-class";
import { Course } from "@/domain/course/entity";
import StudentClassService from "@/domain/student-class/services/student-class.service";
import { UpdateStudentClassRepository } from "@/domain/student-class/repository";
import { Student } from "@/domain/student/entity/student";
import { Gender } from "@/domain/@shared/enums/gender";

type SutsProps = {
  studentClass?: StudentClass;
  students: Map<string, Student>;
};
type Suts = {
  updateRepo: UpdateStudentClassRepository;
  sut: UpdateStudentClassUseCase;
};

const makeStudentClass = (): StudentClass => {
  const course = new Course(uuid(), faker.name.jobArea(), true);
  const studentClass = StudentClassService.newStudentClass(
    course,
    faker.random.word()
  );
  return studentClass;
};

const makeStudents = () => {
  const student1 = new Student(uuid(), faker.name.firstName(), Gender.F, true);
  const student2 = new Student(uuid(), faker.name.firstName(), Gender.F, true);

  const studentsMap = new Map<string, Student>();
  studentsMap.set(student1.id, student1);
  studentsMap.set(student2.id, student2);

  return { student1, student2, studentsMap };
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
  const findStudentRepo = {
    async find(id: string): Promise<Student | undefined> {
      return props.students.get(id);
    },
  };
  return {
    updateRepo,
    sut: new UpdateStudentClassUseCase(findRepo, updateRepo, findStudentRepo),
  };
};
describe("Update Student Class Use Case", () => {
  it("Fail updating invalid student class", async () => {
    const { sut } = makeSuts({
      studentClass: undefined,
      students: new Map<string, Student>(),
    });
    const t = async () => {
      await sut.update({
        id: uuid(),
        name: faker.name.jobArea(),
        active: true,
      });
    };
    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_STUDENT_CLASS);
  });
  it("updating class changing class name", async () => {
    const studentClass = makeStudentClass();

    const { updateRepo, sut } = makeSuts({
      studentClass,
      students: new Map<string, Student>(),
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const newName = faker.random.word();
    const updatedClass = await sut.update({
      id: studentClass.id,
      name: newName,
      active: studentClass.active,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedClass);
    expect(updatedClass.name).toBe(newName);
  });

  it("updating class changing class status", async () => {
    const studentClass = makeStudentClass();

    const { updateRepo, sut } = makeSuts({
      studentClass,
      students: new Map<string, Student>(),
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const newName = faker.random.word();
    const updatedClass = await sut.update({
      id: studentClass.id,
      name: studentClass.name,
      active: false,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedClass);
    expect(updatedClass.active).toBe(false);
  });

  it("updating class adding new student", async () => {
    const studentClass = makeStudentClass();
    const { student1, student2, studentsMap } = makeStudents();
    const { updateRepo, sut } = makeSuts({
      studentClass,
      students: studentsMap,
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedStudentClass = await sut.update({
      id: studentClass.id,
      name: studentClass.name,
      active: studentClass.active,
      students: [
        {
          studentId: student1.id,
          action: "A",
        },
        {
          studentId: student2.id,
          action: "A",
        },
      ],
    });
    expect(spyUpdate).toHaveBeenCalledWith(updatedStudentClass);
    expect(updatedStudentClass.enrollments.length).toBe(2);
  });

  it("Fail updating class adding invalid student", async () => {
    const studentClass = makeStudentClass();
    const { studentsMap } = makeStudents();
    const { sut } = makeSuts({
      studentClass,
      students: studentsMap,
    });

    const t = async () => {
      await sut.update({
        id: studentClass.id,
        name: studentClass.name,
        active: studentClass.active,
        students: [
          {
            studentId: uuid(),
            action: "A",
          },
        ],
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.INVALID_STUDENT);
  });

  it("updating class removing a student", async () => {
    const studentClass = makeStudentClass();
    const { student1, student2, studentsMap } = makeStudents();
    studentClass.enrollStudent(student1);
    studentClass.enrollStudent(student2);
    const { updateRepo, sut } = makeSuts({
      studentClass,
      students: studentsMap,
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedStudentClass = await sut.update({
      id: studentClass.id,
      name: studentClass.name,
      active: studentClass.active,
      students: [
        {
          studentId: student1.id,
          action: "D",
        },
      ],
    });
    expect(spyUpdate).toHaveBeenCalledWith(updatedStudentClass);
    expect(updatedStudentClass.enrollments.length).toBe(1);
  });

  it("Fail updating class removing invalid student", async () => {
    const studentClass = makeStudentClass();
    const { studentsMap } = makeStudents();
    const { sut } = makeSuts({
      studentClass,
      students: studentsMap,
    });

    const t = async () => {
      await sut.update({
        id: studentClass.id,
        name: studentClass.name,
        active: studentClass.active,
        students: [
          {
            studentId: uuid(),
            action: "D",
          },
        ],
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.INVALID_STUDENT);
  });
});

import { Gender } from "@/domain/@shared/enums/gender";
import {
  BadRequestException,
  EntityNotFoundException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { Course } from "@/domain/course/entity";
import { StudentClass } from "@/domain/student-class/entity";
import { UpdateStudentClassRepository } from "@/domain/student-class/repository";
import StudentClassService from "@/domain/student-class/services/student-class.service";
import { Student } from "@/domain/student/entity/student";
import { Teacher } from "@/domain/teacher/entity";
import { UpdateAction } from "@/usecases/@shared/enums";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { UpdateStudentClassUseCase } from "../update-student-class";

type SutsProps = {
  studentClass?: StudentClass;
  students?: Map<string, Student>;
  teachers?: Map<string, Teacher>;
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
  const student1 = new Student({
    id: uuid(),
    name: faker.name.firstName(),
    gender: Gender.F,
    active: true,
  });
  const student2 = new Student({
    id: uuid(),
    name: faker.name.firstName(),
    gender: Gender.F,
    active: true,
  });

  const studentsMap = new Map<string, Student>();
  studentsMap.set(student1.id, student1);
  studentsMap.set(student2.id, student2);

  return { student1, student2, studentsMap };
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
      return props.students?.get(id);
    },
  };
  const findTeacherRepo = {
    async find(id: string): Promise<Teacher | undefined> {
      return props.teachers?.get(id);
    },
  };

  return {
    updateRepo,
    sut: new UpdateStudentClassUseCase(
      findRepo,
      updateRepo,
      findStudentRepo,
      findTeacherRepo
    ),
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
          action: UpdateAction.A,
        },
        {
          studentId: student2.id,
          action: UpdateAction.A,
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
            action: UpdateAction.A,
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
          action: UpdateAction.D,
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
            action: UpdateAction.D,
          },
        ],
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.INVALID_STUDENT);
  });

  it("updating class adding new teacher", async () => {
    const studentClass = makeStudentClass();
    const { teacher1, teacher2, teachersMap } = makeTeachers();
    const { updateRepo, sut } = makeSuts({
      studentClass,
      teachers: teachersMap,
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedStudentClass = await sut.update({
      id: studentClass.id,
      name: studentClass.name,
      active: studentClass.active,
      teachers: [
        {
          teacherId: teacher1.id,
          action: UpdateAction.A,
        },
        {
          teacherId: teacher2.id,
          action: UpdateAction.A,
        },
      ],
    });
    expect(spyUpdate).toHaveBeenCalledWith(updatedStudentClass);
    expect(updatedStudentClass.teacherIds.length).toBe(2);
  });

  it("Fail updating class adding invalid teacher", async () => {
    const studentClass = makeStudentClass();
    const { teachersMap } = makeTeachers();
    const { sut } = makeSuts({
      studentClass,
      teachers: teachersMap,
    });

    const t = async () => {
      await sut.update({
        id: studentClass.id,
        name: studentClass.name,
        active: studentClass.active,
        teachers: [
          {
            teacherId: uuid(),
            action: UpdateAction.A,
          },
        ],
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.INVALID_TEACHER);
  });

  it("updating class removing a teacher", async () => {
    const studentClass = makeStudentClass();
    const { teacher1, teacher2, teachersMap } = makeTeachers();
    studentClass.addTeacher(teacher1);
    studentClass.addTeacher(teacher2);
    const { updateRepo, sut } = makeSuts({
      studentClass,
      teachers: teachersMap,
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedStudentClass = await sut.update({
      id: studentClass.id,
      name: studentClass.name,
      active: studentClass.active,
      teachers: [
        {
          teacherId: teacher1.id,
          action: UpdateAction.D,
        },
      ],
    });
    expect(spyUpdate).toHaveBeenCalledWith(updatedStudentClass);
    expect(updatedStudentClass.teacherIds.length).toBe(1);
  });

  it("Fail updating class removing invalid teacher", async () => {
    const studentClass = makeStudentClass();
    const { teachersMap } = makeTeachers();
    const { sut } = makeSuts({
      studentClass,
      teachers: teachersMap,
    });

    const t = async () => {
      await sut.update({
        id: studentClass.id,
        name: studentClass.name,
        active: studentClass.active,
        teachers: [
          {
            teacherId: uuid(),
            action: UpdateAction.D,
          },
        ],
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.INVALID_TEACHER);
  });
});

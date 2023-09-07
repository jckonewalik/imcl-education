import { Gender } from "@/domain/@shared/enums/gender";
import { BadRequestException } from "@/domain/@shared/exceptions";
import { DateUtils } from "@/domain/@shared/util/date-utils";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { ClassRegistry } from "@/domain/class-registry/entity";
import {
  CreateClassRegistryRepository,
  FindClassRegitryByDateRepository,
} from "@/domain/class-registry/repository";
import { Course } from "@/domain/course/entity";
import { StudentClass } from "@/domain/student-class/entity";
import { Student } from "@/domain/student/entity";
import { Teacher } from "@/domain/teacher/entity";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { CreateClassRegistryUseCase } from "../create-class-registry";
type SutProps = {
  findRepo?: FindClassRegitryByDateRepository;
  studentClass?: StudentClass;
  teacher?: Teacher;
  course?: Course;
};
type Suts = {
  sut: CreateClassRegistryUseCase;
  createRepo: CreateClassRegistryRepository;
};

const makeStudentClass = ({
  id = uuid(),
  courseId = uuid(),
  name = faker.random.word(),
  active = true,
  teacherIds = [] as string[],
  studentIds = [] as string[],
}) => {
  return StudentClass.Builder.builder(id, courseId, name, active)
    .teacherIds(teacherIds)
    .studentIds(studentIds)
    .build();
};

const makeTeacher = ({
  id = uuid(),
  name = `${faker.name.firstName()} ${faker.name.lastName()}`,
  gender = Gender.F,
  email = new Email(faker.internet.email()),
  active = true,
}) => {
  return new Teacher(id, name, gender, email, active);
};

const makeStudent = ({
  id = uuid(),
  studentClassId = faker.datatype.uuid(),
  name = faker.name.firstName(),
  gender = Gender.M,
  active = true,
}) => {
  return new Student({ id, name, gender, active, studentClassId });
};
const makeCourse = ({ name = faker.random.word(), active = true }) => {
  const course = new Course(uuid(), name, active);
  course.addLesson(1, faker.random.word());
  course.addLesson(2, faker.random.word());
  return course;
};

const makeSut = ({
  findRepo = {
    async find(
      studentClassId: string,
      date: Date
    ): Promise<ClassRegistry | undefined> {
      return undefined;
    },
  },
  studentClass,
  teacher,
  course,
}: SutProps): Suts => {
  const findStudentClassRepo = {
    async find(id: string) {
      return studentClass;
    },
  };
  const findTeacherRepo = {
    async find(id: string) {
      return teacher;
    },
  };
  const findCourseRepo = {
    async find(id: string) {
      return course;
    },
  };
  const createRepo = {
    async create(date: ClassRegistry) {},
  };
  const sut = new CreateClassRegistryUseCase(
    findRepo,
    findStudentClassRepo,
    findTeacherRepo,
    findCourseRepo,
    createRepo
  );

  return { createRepo, sut };
};

describe("Create Class Registry Use Case", () => {
  it("Fail creating class registry with invalid student class", async () => {
    const { sut } = makeSut({ teacher: makeTeacher({}) });
    const t = async () => {
      await sut.create({
        studentClassId: uuid(),
        date: new Date(),
        teacherId: uuid(),
        studentIds: [uuid()],
        lessonIds: [],
      });
    };

    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_STUDENT_CLASS);
  });
  it("Fail creating class registry with inactive student class", async () => {
    const { sut } = makeSut({
      studentClass: makeStudentClass({ active: false }),
      teacher: makeTeacher({}),
    });
    const t = async () => {
      await sut.create({
        studentClassId: uuid(),
        date: new Date(),
        teacherId: uuid(),
        studentIds: [uuid()],
        lessonIds: [],
      });
    };

    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.STUDENT_CLASS_INACTIVE);
  });
  it("Fail creating two class registry with same student class and date ", async () => {
    const findRepo = {
      async find(
        studentClassId: string,
        date: Date
      ): Promise<ClassRegistry | undefined> {
        return new ClassRegistry({
          id: uuid(),
          studentClassId: uuid(),
          date: new Date(),
          teacherId: uuid(),
          studentIds: [uuid()],
        });
      },
    };
    const { sut } = makeSut({
      findRepo,
      studentClass: makeStudentClass({}),
      teacher: makeTeacher({}),
    });
    const t = async () => {
      await sut.create({
        studentClassId: uuid(),
        date: new Date(),
        teacherId: uuid(),
        studentIds: [uuid()],
        lessonIds: [],
      });
    };

    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.DUPLICATED_CLASS_REGISTRY);
  });
  it("Fail creating class registry with invalid teacher", async () => {
    const { sut } = makeSut({
      studentClass: makeStudentClass({}),
    });
    const t = async () => {
      await sut.create({
        studentClassId: uuid(),
        date: new Date(),
        teacherId: uuid(),
        studentIds: [uuid()],
        lessonIds: [],
      });
    };

    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_TEACHER);
  });

  it("Fail creating class registry with inactive teacher", async () => {
    const { sut } = makeSut({
      studentClass: makeStudentClass({}),
      teacher: makeTeacher({ active: false }),
    });
    const t = async () => {
      await sut.create({
        studentClassId: uuid(),
        date: new Date(),
        teacherId: uuid(),
        studentIds: [uuid()],
        lessonIds: [],
      });
    };

    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.TEACHER_INACTIVE);
  });

  it("Fail creating class registry if teacher is not associated to the class", async () => {
    const teacher = makeTeacher({});
    const { sut } = makeSut({
      studentClass: makeStudentClass({}),
      teacher,
    });
    const t = async () => {
      await sut.create({
        studentClassId: uuid(),
        date: new Date(),
        teacherId: uuid(),
        studentIds: [uuid()],
        lessonIds: [],
      });
    };

    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.TEACHER_NOT_PRESENT);
  });

  it("Fail creating class registry with students not associated to the class", async () => {
    const teacher = makeTeacher({});
    const course = makeCourse({});
    const { sut } = makeSut({
      studentClass: makeStudentClass({
        teacherIds: [teacher.id],
      }),
      teacher,
      course,
    });
    const t = async () => {
      await sut.create({
        studentClassId: uuid(),
        date: new Date(),
        teacherId: teacher.id,
        studentIds: [uuid()],
        lessonIds: [course.lessons[0].id],
      });
    };

    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.STUDENT_NOT_ASSOCIATED);
  });

  it("Fail creating class registry with lessons not registered on selected course", async () => {
    const teacher = makeTeacher({});
    const course = makeCourse({});
    const student = makeStudent({});
    const studentClass = makeStudentClass({
      teacherIds: [teacher.id],
      studentIds: [student.id],
    });
    const { sut } = makeSut({
      studentClass,
      teacher,
      course,
    });
    const t = async () => {
      await sut.create({
        studentClassId: uuid(),
        date: new Date(),
        teacherId: teacher.id,
        studentIds: [student.id],
        lessonIds: [uuid()],
      });
    };

    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_LESSON);
  });

  it("Creating class registry", async () => {
    const teacher = makeTeacher({});
    const course = makeCourse({});
    const student = makeStudent({});
    const studentClass = makeStudentClass({
      teacherIds: [teacher.id],
      studentIds: [student.id],
    });

    const { createRepo, sut } = makeSut({
      studentClass,
      teacher,
      course,
    });
    const spyCreate = jest.spyOn(createRepo, "create");

    const studentClassId = uuid();
    const date = new Date();
    const registry = await sut.create({
      studentClassId,
      date,
      teacherId: teacher.id,
      studentIds: [student.id],
      lessonIds: [course.lessons[0].id],
    });

    expect(registry.studentClassId).toBe(studentClassId);
    expect(registry.date).toStrictEqual(DateUtils.toSimpleDate(date));
    expect(registry.teacherId).toBe(teacher.id);
    expect(registry.studentIds).toStrictEqual([student.id]);
    expect(registry.lessonIds).toStrictEqual([course.lessons[0].id]);
    expect(spyCreate).toHaveBeenCalledWith(registry);
  });
});

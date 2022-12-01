import { Gender } from "@/domain/@shared/enums/gender";
import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import { DateUtils } from "@/domain/@shared/util/date-utils";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { ClassRegistry } from "@/domain/class-registry/entity";
import { UpdateClassRegistryRepository } from "@/domain/class-registry/repository";
import { Course } from "@/domain/course/entity";
import { StudentClass } from "@/domain/student-class/entity";
import { Student } from "@/domain/student/entity/student";
import { Teacher } from "@/domain/teacher/entity";
import { UpdateAction } from "@/usecases/@shared/enums";
import { BadRequestException } from "@nestjs/common";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { UpdateClassRegistryUseCase } from "../update-class-registry";

type SutsProps = {
  classRegistry?: ClassRegistry;
  teachers?: Map<string, Teacher>;
  students?: Map<string, Student>;
  studentClasses?: Map<string, StudentClass>;
  courses?: Map<string, Course>;
};
type Suts = {
  updateRepo: UpdateClassRegistryRepository;
  sut: UpdateClassRegistryUseCase;
};

const makeClassRegistry = ({
  studentClassId = uuid(),
  date = new Date(),
  teacherId = uuid(),
  students = [uuid()],
  lessons = [] as string[],
}): ClassRegistry => {
  const registry = new ClassRegistry(
    uuid(),
    studentClassId,
    date,
    teacherId,
    students,
    lessons
  );
  return registry;
};

const makeStudents = () => {
  const student1 = new Student(uuid(), faker.name.firstName(), Gender.F, true);
  const student2 = new Student(uuid(), faker.name.firstName(), Gender.F, true);
  const student3 = new Student(uuid(), faker.name.firstName(), Gender.F, true);

  const studentsMap = new Map<string, Student>();
  studentsMap.set(student1.id, student1);
  studentsMap.set(student2.id, student2);
  studentsMap.set(student3.id, student3);
  return { student1, student2, student3, studentsMap };
};

const makeCourses = () => {
  const course1 = new Course(uuid(), faker.random.word(), true);
  course1.addLesson(1, faker.random.word());
  const course2 = new Course(uuid(), faker.name.firstName(), true);
  course2.addLesson(1, faker.random.word());

  const coursesMap = new Map<string, Course>();
  coursesMap.set(course1.id, course1);
  coursesMap.set(course2.id, course2);

  return { course1, course2, coursesMap };
};

const makeStudentClasses = ({ courseId = uuid() }) => {
  const class1 = StudentClass.Builder.builder(
    uuid(),
    courseId,
    faker.random.word(),
    true
  ).build();
  const studentClassesMap = new Map<string, StudentClass>();
  studentClassesMap.set(class1.id, class1);
  return { class1, studentClassesMap };
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
    async find(id: string): Promise<ClassRegistry | undefined> {
      return props.classRegistry;
    },
  };
  const updateRepo = {
    async update(classRegistry: ClassRegistry): Promise<void> {},
  };
  const findTeacherRepo = {
    async find(id: string): Promise<Teacher | undefined> {
      return props.teachers?.get(id);
    },
  };
  const findStudentRepo = {
    async find(id: string): Promise<Student | undefined> {
      return props.students?.get(id);
    },
  };
  const findStudentClassRepo = {
    async find(id: string): Promise<StudentClass | undefined> {
      return props.studentClasses?.get(id);
    },
  };
  const findCourseRepo = {
    async find(id: string): Promise<Course | undefined> {
      return props.courses?.get(id);
    },
  };

  return {
    updateRepo,
    sut: new UpdateClassRegistryUseCase(
      findRepo,
      updateRepo,
      findTeacherRepo,
      findStudentRepo,
      findStudentClassRepo,
      findCourseRepo
    ),
  };
};
describe("Update Class Registry Use Case", () => {
  it("Fail updating invalid class registry", async () => {
    const { sut } = makeSuts({
      classRegistry: undefined,
    });
    const t = async () => {
      await sut.update({
        id: uuid(),
        teacherId: uuid(),
        date: new Date(),
      });
    };
    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_CLASS_REGISTRY);
  });
  it("Fail updating class with invalid teacher", async () => {
    const classRegistry = makeClassRegistry({});

    const { updateRepo, sut } = makeSuts({
      classRegistry,
      students: new Map<string, Student>(),
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);

    const t = async () => {
      await sut.update({
        id: classRegistry.id,
        teacherId: uuid(),
        date: newDate,
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.INVALID_TEACHER);
  });
  it("updating registry changing teacher", async () => {
    const { teacher1, teacher2, teachersMap } = makeTeachers();
    const classRegistry = makeClassRegistry({ teacherId: teacher1.id });

    const { updateRepo, sut } = makeSuts({
      classRegistry,
      teachers: teachersMap,
      students: new Map<string, Student>(),
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);

    const updatedRegistry = await sut.update({
      id: classRegistry.id,
      teacherId: teacher2.id,
      date: newDate,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedRegistry);
    expect(updatedRegistry.teacherId).toStrictEqual(teacher2.id);
  });
  it("updating registry changing date", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const classRegistry = makeClassRegistry({ teacherId: teacher1.id });

    const { updateRepo, sut } = makeSuts({
      classRegistry,
      teachers: teachersMap,
      students: new Map<string, Student>(),
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);

    const updatedRegistry = await sut.update({
      id: classRegistry.id,
      teacherId: teacher1.id,
      date: newDate,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedRegistry);
    expect(updatedRegistry.date).toStrictEqual(DateUtils.toSimpleDate(newDate));
  });

  it("updating registry adding new student", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const { student1, student2, student3, studentsMap } = makeStudents();

    const classRegistry = makeClassRegistry({
      teacherId: teacher1.id,
      students: [student3.id],
    });
    const { updateRepo, sut } = makeSuts({
      classRegistry,
      teachers: teachersMap,
      students: studentsMap,
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedRegistry = await sut.update({
      id: classRegistry.id,
      teacherId: teacher1.id,
      date: classRegistry.date,
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
    expect(spyUpdate).toHaveBeenCalledWith(updatedRegistry);
    expect(updatedRegistry.studentIds.length).toBe(3);
  });

  it("Fail updating registry adding invalid student", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const { student3, studentsMap } = makeStudents();

    const classRegistry = makeClassRegistry({
      teacherId: teacher1.id,
      students: [student3.id],
    });
    const { sut } = makeSuts({
      classRegistry,
      teachers: teachersMap,
      students: studentsMap,
    });

    const t = async () => {
      await sut.update({
        id: classRegistry.id,
        teacherId: classRegistry.teacherId,
        date: classRegistry.date,
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

  it("updating registry removing a student", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const { student2, student3, studentsMap } = makeStudents();

    const classRegistry = makeClassRegistry({
      teacherId: teacher1.id,
      students: [student3.id, student2.id],
    });
    const { updateRepo, sut } = makeSuts({
      classRegistry,
      teachers: teachersMap,
      students: studentsMap,
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedRegistry = await sut.update({
      id: classRegistry.id,
      teacherId: teacher1.id,
      date: classRegistry.date,
      students: [
        {
          studentId: student3.id,
          action: UpdateAction.D,
        },
      ],
    });
    expect(spyUpdate).toHaveBeenCalledWith(updatedRegistry);
    expect(updatedRegistry.studentIds.length).toBe(1);
  });

  it("Fail updating registry removing all student", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const { student3, studentsMap } = makeStudents();

    const classRegistry = makeClassRegistry({
      teacherId: teacher1.id,
      students: [student3.id],
    });
    const { sut } = makeSuts({
      classRegistry,
      teachers: teachersMap,
      students: studentsMap,
    });

    const t = async () => {
      await sut.update({
        id: classRegistry.id,
        teacherId: classRegistry.teacherId,
        date: classRegistry.date,
        students: [
          {
            studentId: student3.id,
            action: UpdateAction.D,
          },
        ],
      });
    };
    expect(t).rejects.toThrow(Messages.CLASS_REGISTRY_WITH_NO_STUDENTS);
  });

  it("Fail updating registry removing invalid student", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const { student2, student3, studentsMap } = makeStudents();

    const classRegistry = makeClassRegistry({
      teacherId: teacher1.id,
      students: [student3.id, student2.id],
    });
    const { sut } = makeSuts({
      classRegistry,
      teachers: teachersMap,
      students: studentsMap,
    });

    const t = async () => {
      await sut.update({
        id: classRegistry.id,
        teacherId: teacher1.id,
        date: classRegistry.date,
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

  it("updating registry adding new lesson", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const { student3, studentsMap } = makeStudents();
    const { course1, coursesMap } = makeCourses();
    const { class1, studentClassesMap } = makeStudentClasses({
      courseId: course1.id,
    });

    const classRegistry = makeClassRegistry({
      studentClassId: class1.id,
      teacherId: teacher1.id,
      students: [student3.id],
    });
    const { updateRepo, sut } = makeSuts({
      classRegistry,
      courses: coursesMap,
      teachers: teachersMap,
      students: studentsMap,
      studentClasses: studentClassesMap,
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedRegistry = await sut.update({
      id: classRegistry.id,
      teacherId: teacher1.id,
      date: classRegistry.date,
      lessons: [
        {
          lessonId: course1.lessons[0].id,
          action: UpdateAction.A,
        },
      ],
    });
    expect(spyUpdate).toHaveBeenCalledWith(updatedRegistry);
    expect(updatedRegistry.lessonIds.length).toBe(1);
  });

  it("Fail updating registry adding invalid lesson", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const { student3, studentsMap } = makeStudents();
    const { course1, coursesMap } = makeCourses();
    const { class1, studentClassesMap } = makeStudentClasses({
      courseId: course1.id,
    });

    const classRegistry = makeClassRegistry({
      studentClassId: class1.id,
      teacherId: teacher1.id,
      students: [student3.id],
    });
    const { sut } = makeSuts({
      classRegistry,
      courses: coursesMap,
      teachers: teachersMap,
      students: studentsMap,
      studentClasses: studentClassesMap,
    });

    const t = async () => {
      await sut.update({
        id: classRegistry.id,
        teacherId: teacher1.id,
        date: classRegistry.date,
        lessons: [
          {
            lessonId: uuid(),
            action: UpdateAction.A,
          },
        ],
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.INVALID_LESSON);
  });

  it("updating registry removing lesson", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const { student3, studentsMap } = makeStudents();
    const { course1, coursesMap } = makeCourses();
    const { class1, studentClassesMap } = makeStudentClasses({
      courseId: course1.id,
    });

    const classRegistry = makeClassRegistry({
      studentClassId: class1.id,
      teacherId: teacher1.id,
      students: [student3.id],
      lessons: [course1.lessons[0].id],
    });
    const { updateRepo, sut } = makeSuts({
      classRegistry,
      courses: coursesMap,
      teachers: teachersMap,
      students: studentsMap,
      studentClasses: studentClassesMap,
    });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedRegistry = await sut.update({
      id: classRegistry.id,
      teacherId: teacher1.id,
      date: classRegistry.date,
      lessons: [
        {
          lessonId: course1.lessons[0].id,
          action: UpdateAction.D,
        },
      ],
    });
    expect(spyUpdate).toHaveBeenCalledWith(updatedRegistry);
    expect(updatedRegistry.lessonIds.length).toBe(0);
  });

  it("Fail updating registry removing invalid lesson", async () => {
    const { teacher1, teachersMap } = makeTeachers();
    const { student3, studentsMap } = makeStudents();
    const { course1, coursesMap } = makeCourses();
    const { class1, studentClassesMap } = makeStudentClasses({
      courseId: course1.id,
    });

    const classRegistry = makeClassRegistry({
      studentClassId: class1.id,
      teacherId: teacher1.id,
      students: [student3.id],
      lessons: [course1.lessons[0].id],
    });
    const { sut } = makeSuts({
      classRegistry,
      courses: coursesMap,
      teachers: teachersMap,
      students: studentsMap,
      studentClasses: studentClassesMap,
    });

    const t = async () => {
      await sut.update({
        id: classRegistry.id,
        teacherId: teacher1.id,
        date: classRegistry.date,
        lessons: [
          {
            lessonId: uuid(),
            action: UpdateAction.D,
          },
        ],
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.INVALID_LESSON);
  });
});

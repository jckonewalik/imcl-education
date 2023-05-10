import { Gender } from "@/domain/@shared/enums/gender";
import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import { DateUtils } from "@/domain/@shared/util/date-utils";
import Messages from "@/domain/@shared/util/messages";
import { Lesson } from "@/domain/course/entity";
import { Student } from "@/domain/student/entity";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { ClassRegistry } from "../class-registry";
describe("Class Registry Unit tests", () => {
  it("Fail when create a class registry without an ID", () => {
    const t = () => {
      new ClassRegistry({
        id: "",
        studentClassId: uuid(),
        date: new Date(),
        teacherId: uuid(),
        studentIds: [uuid()],
      });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_CLASS_REGISTRY_ID);
  });

  it("Fail when create a class registry without a student class ID", () => {
    const t = () => {
      new ClassRegistry({
        id: uuid(),
        studentClassId: "",
        date: new Date(),
        teacherId: uuid(),
        studentIds: [uuid()],
      });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_CLASS_ID);
  });

  it("Fail when create a class registry with future date", () => {
    let date = new Date();
    date.setDate(date.getDate() + 1);

    const t = () => {
      new ClassRegistry({
        id: uuid(),
        studentClassId: uuid(),
        date,
        teacherId: uuid(),
        studentIds: [uuid()],
      });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.CLASS_DATE_CANT_BE_IN_FUTURE);
  });

  it("Fail when create a class registry without a teacher ID", () => {
    const t = () => {
      new ClassRegistry({
        id: uuid(),
        studentClassId: uuid(),
        date: new Date(),
        teacherId: "",
        studentIds: [uuid()],
      });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_TEACHER_ID);
  });

  it("Fail when create a class registry with no students", () => {
    const t = () => {
      new ClassRegistry({
        id: uuid(),
        studentClassId: uuid(),
        date: new Date(),
        teacherId: uuid(),
        studentIds: [],
      });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.CLASS_REGISTRY_WITH_NO_STUDENTS);
  });

  it("Not add duplicated lesson on class registry", () => {
    const lessonId = uuid();
    const lesson = new Lesson(lessonId, uuid(), 1, faker.random.word(), true);
    const classRegistry = new ClassRegistry({
      id: uuid(),
      studentClassId: uuid(),
      date: new Date(),
      teacherId: uuid(),
      studentIds: [uuid()],
      lessonIds: [lessonId],
    });

    classRegistry.addLesson(lesson);

    expect(classRegistry.lessonIds.length).toBe(1);
  });
  it("Fail add inactive lesson on class registry", () => {
    const lesson = new Lesson(uuid(), uuid(), 1, faker.random.word(), false);
    const classRegistry = new ClassRegistry({
      id: uuid(),
      studentClassId: uuid(),
      date: new Date(),
      teacherId: uuid(),
      studentIds: [uuid()],
    });
    const t = () => {
      classRegistry.addLesson(lesson);
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.LESSON_INACTIVE);
  });
  it("Add lesson on class registry", () => {
    const lesson = new Lesson(uuid(), uuid(), 1, faker.random.word(), true);
    const classRegistry = new ClassRegistry({
      id: uuid(),
      studentClassId: uuid(),
      date: new Date(),
      teacherId: uuid(),
      studentIds: [uuid()],
    });
    classRegistry.addLesson(lesson);
    expect(classRegistry.lessonIds.length).toBe(1);
  });

  it("Remove lesson on class registry", () => {
    const lesson = new Lesson(uuid(), uuid(), 1, faker.random.word(), true);
    const classRegistry = new ClassRegistry({
      id: uuid(),
      studentClassId: uuid(),
      date: new Date(),
      teacherId: uuid(),
      studentIds: [uuid()],
      lessonIds: [lesson.id],
    });
    classRegistry.removeLesson(lesson);
    expect(classRegistry.lessonIds.length).toBe(0);
  });

  it("Not add duplicated student on class registry", () => {
    const studentId = uuid();
    const student = new Student(studentId, uuid(), Gender.F, true);
    const classRegistry = new ClassRegistry({
      id: uuid(),
      studentClassId: uuid(),
      date: new Date(),
      teacherId: uuid(),
      studentIds: [studentId],
    });

    classRegistry.addStudent(student);

    expect(classRegistry.studentIds.length).toBe(1);
  });
  it("Fail add inactive student on class registry", () => {
    const student = new Student(uuid(), uuid(), Gender.F, false);
    const classRegistry = new ClassRegistry({
      id: uuid(),
      studentClassId: uuid(),
      date: new Date(),
      teacherId: uuid(),
      studentIds: [uuid()],
    });
    const t = () => {
      classRegistry.addStudent(student);
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_INACTIVE);
  });
  it("Add student on class registry", () => {
    const student = new Student(uuid(), uuid(), Gender.F, true);
    const classRegistry = new ClassRegistry({
      id: uuid(),
      studentClassId: uuid(),
      date: new Date(),
      teacherId: uuid(),
      studentIds: [uuid()],
    });
    classRegistry.addStudent(student);
    expect(classRegistry.studentIds.length).toBe(2);
  });

  it("Remove student on class registry", () => {
    const student = new Student(uuid(), uuid(), Gender.F, true);
    const classRegistry = new ClassRegistry({
      id: uuid(),
      studentClassId: uuid(),
      date: new Date(),
      teacherId: uuid(),
      studentIds: [student.id],
    });
    classRegistry.removeStudent(student);
    expect(classRegistry.lessonIds.length).toBe(0);
  });
  it("Fail updating class registry date with future date", () => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);
    const classRegistry = new ClassRegistry({
      id: uuid(),
      studentClassId: uuid(),
      date: new Date(),
      teacherId: uuid(),
      studentIds: [uuid()],
    });
    const t = () => {
      classRegistry.updateDate(newDate);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.CLASS_DATE_CANT_BE_IN_FUTURE);
  });

  it("Update class registry date", () => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);
    const classRegistry = new ClassRegistry({
      id: uuid(),
      studentClassId: uuid(),
      date: new Date(),
      teacherId: uuid(),
      studentIds: [uuid()],
    });
    classRegistry.updateDate(newDate);
    expect(classRegistry.date).toStrictEqual(DateUtils.toSimpleDate(newDate));
  });
});

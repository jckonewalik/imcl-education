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
      new ClassRegistry("", uuid(), new Date(), uuid(), [uuid()]);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_CLASS_REGISTRY_ID);
  });

  it("Fail when create a class registry without a student class ID", () => {
    const t = () => {
      new ClassRegistry(uuid(), "", new Date(), uuid(), [uuid()]);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_CLASS_ID);
  });

  it("Fail when create a class registry with future date", () => {
    let date = new Date();
    date.setDate(date.getDate() + 1);

    const t = () => {
      new ClassRegistry(uuid(), uuid(), date, uuid(), [uuid()]);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.CLASS_DATE_CANT_BE_IN_FUTURE);
  });

  it("Fail when create a class registry without a teacher ID", () => {
    const t = () => {
      new ClassRegistry(uuid(), uuid(), new Date(), "", [uuid()]);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_TEACHER_ID);
  });

  it("Fail when create a class registry with no students", () => {
    const t = () => {
      new ClassRegistry(uuid(), uuid(), new Date(), uuid(), []);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.CLASS_REGISTRY_WITH_NO_STUDENTS);
  });

  it("Fail add duplicated lesson on class registry", () => {
    const lessonId = uuid();
    const lesson = new Lesson(lessonId, uuid(), 1, faker.random.word(), true);
    const classRegistry = new ClassRegistry(
      uuid(),
      uuid(),
      new Date(),
      uuid(),
      [uuid()],
      [lessonId]
    );
    const t = () => {
      classRegistry.addLesson(lesson);
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.LESSON_ALREADY_INCLUDED);
  });
  it("Fail add inactive lesson on class registry", () => {
    const lesson = new Lesson(uuid(), uuid(), 1, faker.random.word(), false);
    const classRegistry = new ClassRegistry(
      uuid(),
      uuid(),
      new Date(),
      uuid(),
      [uuid()]
    );
    const t = () => {
      classRegistry.addLesson(lesson);
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.LESSON_INACTIVE);
  });
  it("Add lesson on class registry", () => {
    const lesson = new Lesson(uuid(), uuid(), 1, faker.random.word(), true);
    const classRegistry = new ClassRegistry(
      uuid(),
      uuid(),
      new Date(),
      uuid(),
      [uuid()]
    );
    classRegistry.addLesson(lesson);
    expect(classRegistry.lessonIds.length).toBe(1);
  });

  it("Fail remove not inclued lesson on class registry", () => {
    const lesson = new Lesson(uuid(), uuid(), 1, faker.random.word(), true);
    const classRegistry = new ClassRegistry(
      uuid(),
      uuid(),
      new Date(),
      uuid(),
      [uuid()]
    );
    const t = () => {
      classRegistry.removeLesson(lesson);
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.LESSON_NOT_INCLUDED);
  });
  it("Remove lesson on class registry", () => {
    const lesson = new Lesson(uuid(), uuid(), 1, faker.random.word(), true);
    const classRegistry = new ClassRegistry(
      uuid(),
      uuid(),
      new Date(),
      uuid(),
      [uuid()],
      [lesson.id]
    );
    classRegistry.removeLesson(lesson);
    expect(classRegistry.lessonIds.length).toBe(0);
  });

  it("Fail add duplicated student on class registry", () => {
    const studentId = uuid();
    const student = new Student(studentId, uuid(), Gender.F, true);
    const classRegistry = new ClassRegistry(
      uuid(),
      uuid(),
      new Date(),
      uuid(),
      [studentId]
    );
    const t = () => {
      classRegistry.addStudent(student);
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_ALREADY_INCLUDED);
  });
  it("Fail add inactive student on class registry", () => {
    const student = new Student(uuid(), uuid(), Gender.F, false);
    const classRegistry = new ClassRegistry(
      uuid(),
      uuid(),
      new Date(),
      uuid(),
      [uuid()]
    );
    const t = () => {
      classRegistry.addStudent(student);
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_INACTIVE);
  });
  it("Add student on class registry", () => {
    const student = new Student(uuid(), uuid(), Gender.F, true);
    const classRegistry = new ClassRegistry(
      uuid(),
      uuid(),
      new Date(),
      uuid(),
      [uuid()]
    );
    classRegistry.addStudent(student);
    expect(classRegistry.studentIds.length).toBe(2);
  });
  it("Fail remove not inclued student on class registry", () => {
    const student = new Student(uuid(), uuid(), Gender.F, true);
    const classRegistry = new ClassRegistry(
      uuid(),
      uuid(),
      new Date(),
      uuid(),
      [uuid()]
    );
    const t = () => {
      classRegistry.removeStudent(student);
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_NOT_INCLUDED);
  });
  it("Remove student on class registry", () => {
    const student = new Student(uuid(), uuid(), Gender.F, true);
    const classRegistry = new ClassRegistry(
      uuid(),
      uuid(),
      new Date(),
      uuid(),
      [student.id]
    );
    classRegistry.removeStudent(student);
    expect(classRegistry.lessonIds.length).toBe(0);
  });
  it("Fail updating class registry date with future date", () => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);
    const classRegistry = new ClassRegistry(
      uuid(),
      uuid(),
      new Date(),
      uuid(),
      [uuid()]
    );
    const t = () => {
      classRegistry.updateDate(newDate);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.CLASS_DATE_CANT_BE_IN_FUTURE);
  });

  it("Update class registry date", () => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);
    const classRegistry = new ClassRegistry(
      uuid(),
      uuid(),
      new Date(),
      uuid(),
      [uuid()]
    );
    classRegistry.updateDate(newDate);
    expect(classRegistry.date).toStrictEqual(DateUtils.toSimpleDate(newDate));
  });
});

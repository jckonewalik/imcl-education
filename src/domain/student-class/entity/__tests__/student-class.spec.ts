import { Gender } from "@/domain/@shared/enums/gender";
import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { Student } from "@/domain/student/entity/student";
import { Teacher } from "@/domain/teacher/entity";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { StudentClass } from "../student-class";

const makeStudentClass = ({
  id = uuid(),
  courseId = uuid(),
  name = faker.name.jobArea(),
  active = true,
}): StudentClass => {
  return StudentClass.Builder.builder(id, courseId, name, active).build();
};

const makeTeacher = ({
  id = uuid(),
  name = faker.name.firstName(),
  gender = Gender.F,
  email = faker.internet.email(),
  active = true,
}) => {
  return new Teacher(id, name, gender, new Email(email), active);
};

const makeStudent = ({
  id = uuid(),
  name = faker.name.firstName(),
  gender = Gender.M,
  active = true,
}) => {
  return new Student({ id, name, gender, active });
};

describe("Student Class Unit tests", () => {
  it("Fail when create a student class without an ID", () => {
    const t = () => {
      StudentClass.Builder.builder(
        "",
        uuid(),
        faker.name.jobArea(),
        true
      ).build();
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_CLASS_ID);
  });

  it("Fail when create a student class without a course ID", () => {
    const t = () => {
      StudentClass.Builder.builder(
        uuid(),
        "",
        faker.name.jobArea(),
        true
      ).build();
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_COURSE_ID);
  });

  it("Fail when create a course without a name", () => {
    const t = () => {
      StudentClass.Builder.builder(uuid(), uuid(), "", true).build();
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_CLASS_NAME);
  });

  it("Fail when activate a class already active", () => {
    const studentClass = makeStudentClass({});

    const t = () => {
      studentClass.activate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.CLASS_ALREADY_ACTIVE);
  });

  it("Fail when inactivate a class already inactive", () => {
    const studentClass = makeStudentClass({ active: false });

    const t = () => {
      studentClass.inactivate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.CLASS_ALREADY_INACTIVE);
  });

  it("Activate a class", () => {
    const studentClass = makeStudentClass({ active: false });

    studentClass.activate();
    expect(studentClass.active).toBe(true);
  });

  it("Inactivate a class", () => {
    const studentClass = makeStudentClass({});

    studentClass.inactivate();
    expect(studentClass.active).toBe(false);
  });

  it("Fail when enroll a new student if the class is inactive", () => {
    const studentClass = makeStudentClass({ active: false });
    const student = makeStudent({});

    const t = () => {
      studentClass.enrollStudent(student);
    };

    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_CLASS_INACTIVE);
  });

  it("Fail when enroll a new student if the student is inactive", () => {
    const studentClass = makeStudentClass({});
    const student = makeStudent({ active: false });

    const t = () => {
      studentClass.enrollStudent(student);
    };

    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_INACTIVE);
  });

  it("Enroll a new student", () => {
    const studentClass = makeStudentClass({});
    const student = makeStudent({});
    studentClass.enrollStudent(student);

    expect(studentClass.enrollments.length).toBe(1);
  });

  it("Not Enroll a student twice", () => {
    const studentClass = makeStudentClass({});
    const student = makeStudent({});
    studentClass.enrollStudent(student);
    studentClass.enrollStudent(student);

    expect(studentClass.enrollments.length).toBe(1);
  });

  it("Unenroll a student", () => {
    const studentClass = makeStudentClass({});
    const student = makeStudent({});
    studentClass.enrollStudent(student);
    expect(studentClass.enrollments.length).toBe(1);
    studentClass.unenrollStudent(student);
    expect(studentClass.enrollments.length).toBe(0);
  });

  it("Fail adding a new teacher if the class is inactive", () => {
    const studentClass = makeStudentClass({ active: false });
    const teacher = makeTeacher({});

    const t = () => {
      studentClass.addTeacher(teacher);
    };

    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_CLASS_INACTIVE);
  });

  it("Fail adding a new teacher if the teacher is inactive", () => {
    const studentClass = makeStudentClass({});
    const teacher = makeTeacher({ active: false });

    const t = () => {
      studentClass.addTeacher(teacher);
    };

    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.TEACHER_INACTIVE);
  });

  it("Add a new teacher", () => {
    const studentClass = makeStudentClass({});
    const teacher = makeTeacher({});
    studentClass.addTeacher(teacher);

    expect(studentClass.teacherIds.length).toBe(1);
  });

  it("Not add a teacher twice", () => {
    const studentClass = makeStudentClass({});
    const teacher = makeTeacher({});
    studentClass.addTeacher(teacher);
    studentClass.addTeacher(teacher);
    expect(studentClass.teacherIds.length).toBe(1);
  });

  it("Remove a teacher", () => {
    const studentClass = makeStudentClass({});
    const teacher = makeTeacher({});
    studentClass.addTeacher(teacher);
    expect(studentClass.teacherIds.length).toBe(1);
    studentClass.removeTeacher(teacher);
    expect(studentClass.teacherIds.length).toBe(0);
  });
});

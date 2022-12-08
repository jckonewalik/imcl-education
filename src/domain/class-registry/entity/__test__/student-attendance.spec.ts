import { InvalidValueException } from "@/domain/@shared/exceptions";
import { DateUtils } from "@/domain/@shared/util/date-utils";
import Messages from "@/domain/@shared/util/messages";
import { v4 as uuid } from "uuid";
import { StudentAttendance } from "../student-attendance";
describe("Student Attendance Unit tests", () => {
  it("Fail when create an  attendance without a Student Class ID", () => {
    const t = () => {
      new StudentAttendance({
        studentClassId: "",
        studentId: uuid(),
        lessonId: uuid(),
        date: new Date(),
        finished: true,
      });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_CLASS_ID);
  });

  it("Fail when create an  attendance without a Student ID", () => {
    const t = () => {
      new StudentAttendance({
        studentClassId: uuid(),
        studentId: "",
        lessonId: uuid(),
        date: new Date(),
        finished: true,
      });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_ID);
  });

  it("Fail when create an  attendance without a Lesson ID", () => {
    const t = () => {
      new StudentAttendance({
        studentClassId: uuid(),
        studentId: uuid(),
        lessonId: "",
        date: new Date(),
        finished: true,
      });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_LESSON_ID);
  });

  it("Fail when create an attendance without a Date when its finished", () => {
    const t = () => {
      new StudentAttendance({
        studentClassId: uuid(),
        studentId: uuid(),
        lessonId: uuid(),
        finished: true,
      });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_ATTENDANCE_DATE);
  });

  it("create an attendance", () => {
    const studentClassId = uuid();
    const studentId = uuid();
    const lessonId = uuid();
    const date = new Date();

    const attendance = new StudentAttendance({
      studentClassId,
      studentId,
      lessonId,
      date,
      finished: true,
    });

    expect(attendance.studentClassId).toBe(studentClassId);
    expect(attendance.studentId).toBe(studentId);
    expect(attendance.lessonId).toBe(lessonId);
    expect(attendance.date).toStrictEqual(DateUtils.toSimpleDate(date));
    expect(attendance.finished).toBeTruthy();
  });
});

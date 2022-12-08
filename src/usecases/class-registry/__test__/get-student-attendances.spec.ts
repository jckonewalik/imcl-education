import { DateUtils } from "@/domain/@shared/util/date-utils";
import { ClassRegistry } from "@/domain/class-registry/entity";
import { v4 as uuid } from "uuid";
import { GetStudentAttendancesUseCase } from "../get-student-attendances";
type SutsProps = {
  registries?: ClassRegistry[];
};

type Suts = {
  sut: GetStudentAttendancesUseCase;
};

const makeSut = ({ registries = [] }: SutsProps): Suts => {
  const findClassRegistryRepo = {
    async find(studentClassId: string) {
      return registries;
    },
  };
  return {
    sut: new GetStudentAttendancesUseCase(findClassRegistryRepo),
  };
};

const makeRegistries = () => {
  const studentClassId = uuid();
  const teacherId = uuid();
  const date1 = new Date();
  const date2 = new Date();
  date2.setDate(date2.getDate() - 1);
  const date3 = new Date();
  date3.setDate(date3.getDate() - 2);
  const date4 = new Date();
  date3.setDate(date4.getDate() - 3);

  const studentId1 = uuid();
  const studentId2 = uuid();
  const studentId3 = uuid();
  const lessonId1 = uuid();
  const lessonId2 = uuid();
  const lessonId3 = uuid();

  const registry1 = new ClassRegistry({
    id: uuid(),
    studentClassId,
    teacherId,
    date: date1,
    studentIds: [studentId1],
    lessonIds: [lessonId1],
  });

  const registry2 = new ClassRegistry({
    id: uuid(),
    studentClassId,
    teacherId,
    date: date2,
    studentIds: [studentId1, studentId2],
    lessonIds: [lessonId2],
  });

  const registry3 = new ClassRegistry({
    id: uuid(),
    studentClassId,
    teacherId,
    date: date3,
    studentIds: [studentId2],
    lessonIds: [lessonId3],
  });
  const registry4 = new ClassRegistry({
    id: uuid(),
    studentClassId,
    teacherId,
    date: date4,
    studentIds: [studentId3],
    lessonIds: [lessonId1],
  });

  return {
    studentClassId,
    teacherId,
    date1,
    date2,
    date3,
    date4,
    studentId1,
    studentId2,
    studentId3,
    lessonId1,
    lessonId2,
    lessonId3,
    registry1,
    registry2,
    registry3,
    registry4,
  };
};

describe("Get Student Attendances Use Case", () => {
  it("Get a student attendances by student class and student id", async () => {
    const {
      studentClassId,
      date2,
      date3,
      studentId2,
      lessonId1,
      lessonId2,
      lessonId3,
      registry1,
      registry2,
      registry3,
      registry4,
    } = makeRegistries();

    const { sut } = makeSut({
      registries: [registry1, registry2, registry3, registry4],
    });

    const attendances = await sut.get(studentClassId, studentId2);

    expect(attendances.length).toBe(3);
    expect(
      attendances.find((a) => a.lessonId === lessonId1)?.finished
    ).toBeFalsy();
    const lesson2Attendance = attendances.find((a) => a.lessonId === lessonId2);
    expect(lesson2Attendance?.finished).toBeTruthy();
    expect(lesson2Attendance?.date).toStrictEqual(
      DateUtils.toSimpleDate(date2)
    );

    const lesson3Attendance = attendances.find((a) => a.lessonId === lessonId3);
    expect(lesson3Attendance?.finished).toBeTruthy();
    expect(lesson3Attendance?.date).toStrictEqual(
      DateUtils.toSimpleDate(date3)
    );
  });
});

import { Gender } from "@/domain/@shared/enums/gender";
import { Email } from "@/domain/@shared/value-objects";
import { ClassRegistry } from "@/domain/class-registry/entity";
import { Course } from "@/domain/course/entity";
import { StudentClass } from "@/domain/student-class/entity";
import { Student } from "@/domain/student/entity";
import { Teacher } from "@/domain/teacher/entity";
import faker from "faker";
import { v4 as uuid } from "uuid";

export const makeClassRegistry = ({
  studentClassId = uuid(),
  date = new Date(),
  teacherId = uuid(),
  students = [uuid()],
  lessons = [] as string[],
}): ClassRegistry => {
  const registry = new ClassRegistry({
    id: uuid(),
    studentClassId,
    date,
    teacherId,
    studentIds: students,
    lessonIds: lessons,
  });
  return registry;
};

export const makeStudents = () => {
  const student1 = new Student(uuid(), faker.name.firstName(), Gender.F, true);
  const student2 = new Student(uuid(), faker.name.firstName(), Gender.F, true);
  const student3 = new Student(uuid(), faker.name.firstName(), Gender.F, true);

  const studentsMap = new Map<string, Student>();
  studentsMap.set(student1.id, student1);
  studentsMap.set(student2.id, student2);
  studentsMap.set(student3.id, student3);
  return { student1, student2, student3, studentsMap };
};

export const makeCourses = () => {
  const course1 = new Course(uuid(), faker.random.word(), true);
  course1.addLesson(1, faker.random.word());
  const course2 = new Course(uuid(), faker.name.firstName(), true);
  course2.addLesson(1, faker.random.word());

  const coursesMap = new Map<string, Course>();
  coursesMap.set(course1.id, course1);
  coursesMap.set(course2.id, course2);

  return { course1, course2, coursesMap };
};

export const makeStudentClasses = ({ courseId = uuid() }) => {
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

export const makeTeachers = () => {
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

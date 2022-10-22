import { Teacher } from "@/domain/teacher/entity";
import { UpdateTeacherRepository } from "@/domain/teacher/repository";
import { v4 as uuid } from "uuid";
import faker from "faker";
import {
  BadRequestException,
  EntityNotFoundException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { UpdateTeacherUseCase } from "../update-teacher";
import { Email } from "@/domain/@shared/value-objects";
import { Gender } from "@/domain/@shared/enums/gender";

type SutsProps = {
  teacher?: Teacher;
  teachers?: Map<string, Teacher>;
};
type Suts = {
  updateRepo: UpdateTeacherRepository;
  sut: UpdateTeacherUseCase;
};

const makeTeacher = ({
  id = uuid(),
  name = faker.name.firstName(),
  gender = Gender.M,
  email = faker.internet.email(),
  active = true,
}): Teacher => {
  const teacher = new Teacher(id, name, gender, new Email(email), active);
  return teacher;
};

const makeSuts = (props: SutsProps): Suts => {
  const findRepo = {
    async find(id: string): Promise<Teacher | undefined> {
      return props.teacher;
    },
  };
  const findByEmailRepo = {
    async find(email: Email): Promise<Teacher | undefined> {
      return props.teachers?.get(email.value);
    },
  };
  const updateRepo = {
    async update(teacher: Teacher): Promise<void> {},
  };
  return {
    updateRepo,
    sut: new UpdateTeacherUseCase(findRepo, findByEmailRepo, updateRepo),
  };
};
describe("Update Teacher Use Case", () => {
  it("Fail updating invalid teacher", async () => {
    const { sut } = makeSuts({ teacher: undefined });
    const t = async () => {
      await sut.update({
        id: uuid(),
        name: faker.name.firstName(),
        email: faker.internet.email(),
        active: true,
      });
    };
    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_TEACHER);
  });
  it("updating teacher changing teacher name", async () => {
    const teacher = makeTeacher({});
    const { updateRepo, sut } = makeSuts({ teacher });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const newName = faker.name.firstName();
    const updatedTeacher = await sut.update({
      id: teacher.id,
      name: newName,
      email: teacher.email.value,
      active: teacher.active,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedTeacher);
    expect(updatedTeacher.name).toBe(newName);
  });

  it("updating teacher changing status", async () => {
    const teacher = makeTeacher({ active: true });
    const { updateRepo, sut } = makeSuts({ teacher });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedTeacher = await sut.update({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email.value,
      active: false,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedTeacher);
    expect(updatedTeacher.active).toBe(false);
  });

  it("Failing updating teacher changing email using an email already in use", async () => {
    const teacher1 = makeTeacher({});
    const teachers = new Map<string, Teacher>();
    teachers.set(teacher1.email.value, teacher1);

    const teacher = makeTeacher({});
    const { updateRepo, sut } = makeSuts({ teacher, teachers });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const newEmail = teacher1.email.value;
    const t = async () =>
      await sut.update({
        id: teacher.id,
        name: teacher.name,
        email: newEmail,
        active: teacher.active,
      });

    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.TEACHER_EMAIL_ALREADY_IN_USE);
  });
  it("updating teacher changing email", async () => {
    const teacher = makeTeacher({});
    const { updateRepo, sut } = makeSuts({ teacher });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const newEmail = faker.internet.email();
    const updatedTeacher = await sut.update({
      id: teacher.id,
      name: teacher.name,
      email: newEmail,
      active: teacher.active,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedTeacher);
    expect(updatedTeacher.email.value).toBe(newEmail);
  });
});

import { Student } from "@/domain/student/entity/student";
import { UpdateStudentRepository } from "@/domain/student/repository";
import { UpdateStudentUseCase } from "../update-student";
import { v4 as uuid } from "uuid";
import faker from "faker";
import { Gender } from "@/domain/@shared/enums/gender";
import { PhoneNumber } from "@/domain/@shared/value-objects";
import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";

type SutsProps = {
  student?: Student;
};
type Suts = {
  updateRepo: UpdateStudentRepository;
  sut: UpdateStudentUseCase;
};

const makeStudent = ({
  id = uuid(),
  name = faker.name.firstName(),
  gender = Gender.M,
  active = true,
  phone = {
    number: "9999999999",
    isWhatsapp: true,
  },
}): Student => {
  const phoneNumber = new PhoneNumber(phone.number, phone.isWhatsapp);
  const student = new Student(id, name, gender, active, phoneNumber);
  return student;
};

const makeSuts = (props: SutsProps): Suts => {
  const findRepo = {
    async find(id: string): Promise<Student | undefined> {
      return props.student;
    },
  };
  const updateRepo = {
    async update(student: Student): Promise<void> {},
  };
  return {
    updateRepo,
    sut: new UpdateStudentUseCase(findRepo, updateRepo),
  };
};
describe("Update Student Use Case", () => {
  it("Fail updating invalid student", async () => {
    const { sut } = makeSuts({ student: undefined });
    const t = async () => {
      await sut.update({
        id: uuid(),
        name: faker.name.firstName(),
        phone: {
          number: "9999999999",
          isWhatsapp: true,
        },
        active: true,
      });
    };
    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_STUDENT);
  });
  it("Updating student changing student name", async () => {
    const student = makeStudent({});
    const { updateRepo, sut } = makeSuts({ student });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const newName = faker.name.firstName();
    const updatedStudent = await sut.update({
      id: student.id,
      name: newName,
      phone: student.phone,
      active: student.active,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedStudent);
    expect(updatedStudent.name).toBe(newName);
  });

  it("Updating student changing status", async () => {
    const student = makeStudent({ active: true });
    const { updateRepo, sut } = makeSuts({ student });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedStudent = await sut.update({
      id: student.id,
      name: student.name,
      phone: student.phone,
      active: false,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedStudent);
    expect(updatedStudent.active).toBe(false);
  });

  it("Updating student changing the phone", async () => {
    const student = makeStudent({
      phone: { number: "9999999999", isWhatsapp: true },
    });
    const { updateRepo, sut } = makeSuts({ student });
    const spyUpdate = jest.spyOn(updateRepo, "update");
    const newPhone = { number: "8888888888", isWhatsapp: true };
    const updatedStudent = await sut.update({
      id: student.id,
      name: student.name,
      phone: newPhone,
      active: student.active,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedStudent);
    expect(updatedStudent.phone?.number).toStrictEqual(newPhone.number);
    expect(updatedStudent.phone?.isWhatsapp).toStrictEqual(newPhone.isWhatsapp);
  });
});

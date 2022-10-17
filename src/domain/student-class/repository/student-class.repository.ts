import Repository from "@/domain/@shared/repository/repository";
import { StudentClass } from "@/domain/student-class/entity";

export default interface StudentClassRepository
  extends Repository<StudentClass> {}

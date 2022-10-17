import Repository from "@/domain/@shared/repository/repository";
import { Course } from "@/domain/course/entity";

export default interface CourseRepository extends Repository<Course> {}

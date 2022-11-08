import {
  CreateRepository,
  FindAllRepository,
  FindRepository,
  UpdateRepository,
} from "@/domain/@shared/repository/repository";
import { Course } from "@/domain/course/entity";

export interface CreateCourseRepository extends CreateRepository<Course> {}

export interface UpdateCourseRepository extends UpdateRepository<Course> {}

export interface FindCourseRepository extends FindRepository<Course> {}

export interface FindAllCoursesRepository extends FindAllRepository<Course> {}

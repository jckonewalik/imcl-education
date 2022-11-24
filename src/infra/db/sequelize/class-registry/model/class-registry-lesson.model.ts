import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { LessonModel } from "../../course/model";
import { ClassRegistryModel } from "./class-registry.model";

@Table({
  tableName: "class_registry_lesson",
  timestamps: false,
})
export class ClassRegistryLessonModel extends Model {
  @ForeignKey(() => ClassRegistryModel)
  @Column({ type: DataType.UUID, field: "class_registry_id" })
  classRegistryId: string;

  @ForeignKey(() => LessonModel)
  @Column({ type: DataType.UUID, field: "lesson_id" })
  lessonId: string;
}

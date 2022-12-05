import { Course } from "@/domain/course/entity";
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { LessonModel } from ".";

@Table({
  tableName: "courses",
  timestamps: true,
})
export class CourseModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column
  name: string;

  @Column
  active: boolean;

  @HasMany(() => LessonModel, {
    onDelete: "CASCADE",
  })
  lessons: LessonModel[];

  @CreatedAt
  @Column({ field: "creation_date" })
  creationDate: Date;

  @UpdatedAt
  @Column({ field: "updated_on" })
  updatedOn: Date;

  toEntity(): Course {
    const lessons = this.lessons?.map((l) => l.toEntity());
    const course = new Course(this.id, this.name, this.active, lessons);
    return course;
  }
}

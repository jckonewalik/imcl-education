import { ClassRegistry } from "@/domain/class-registry/entity";
import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { LessonModel } from "../../course/model";
import { StudentClassModel } from "../../student-class/model";
import { StudentModel } from "../../student/model";
import { TeacherModel } from "../../teacher/model";
import { ClassRegistryLessonModel } from "./class-registry-lesson.model";
import { ClassRegistryStudentModel } from "./class-registry-student.model";

@Table({
  tableName: "class_registries",
  timestamps: true,
})
export class ClassRegistryModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => StudentClassModel)
  @Column({ type: DataType.UUID, field: "student_class_id" })
  studentClassId: string;

  @BelongsTo(() => StudentClassModel)
  studentClass: StudentClassModel;

  @ForeignKey(() => TeacherModel)
  @Column({ type: DataType.UUID, field: "teacher_id" })
  teacherId: string;

  @BelongsTo(() => TeacherModel)
  teacher: TeacherModel;

  @Column({ type: DataType.DATEONLY })
  date: Date;

  @BelongsToMany(() => StudentModel, () => ClassRegistryStudentModel)
  students: StudentModel[];

  @BelongsToMany(() => LessonModel, () => ClassRegistryLessonModel)
  lessons: LessonModel[];

  @CreatedAt
  @Column({ field: "creation_date" })
  creationDate: Date;

  @UpdatedAt
  @Column({ field: "updated_on" })
  updatedOn: Date;

  toEntity(): ClassRegistry {
    return new ClassRegistry({
      id: this.id,
      studentClassId: this.studentClassId,
      date: this.date,
      teacherId: this.teacherId,
      studentIds: this.students?.map((s) => s.id),
      lessonIds: this.lessons?.map((l) => l.id),
    });
  }
}

import { StudentClass } from "@/domain/student-class/entity";
import { CourseModel } from "@/infra/db/sequelize/course/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { StudentClassTeacherModel } from ".";
import { StudentModel } from "../../student/model";

@Table({
  tableName: "student_classes",
  timestamps: true,
})
export class StudentClassModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => CourseModel)
  @Column({ type: DataType.UUID, field: "course_id" })
  courseId: string;

  @BelongsTo(() => CourseModel)
  course: CourseModel;

  @Column
  name: string;

  @Column
  year: number;

  @Column
  active: boolean;

  @BelongsToMany(() => TeacherModel, () => StudentClassTeacherModel)
  teachers: TeacherModel[];

  @HasMany(() => StudentModel)
  students: StudentModel[];

  @CreatedAt
  @Column({ field: "creation_date" })
  creationDate: Date;

  @UpdatedAt
  @Column({ field: "updated_on" })
  updatedOn: Date;

  toEntity(): StudentClass {
    const teacherIds = this.teachers?.map((teacher) => teacher.id);
    const studentIds = this.students?.map((student) => student.id);
    return StudentClass.Builder.builder(
      this.id,
      this.courseId,
      this.name,
      this.active
    )
      .year(this.year || undefined)
      .teacherIds(teacherIds)
      .studentIds(studentIds)
      .build();
  }
}

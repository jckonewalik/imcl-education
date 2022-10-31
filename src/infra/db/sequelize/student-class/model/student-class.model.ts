import { Enrollment, StudentClass } from "@/domain/student-class/entity";
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
import { EnrollmentModel, StudentClassTeacherModel } from ".";

@Table({
  tableName: "student_classes",
  timestamps: true,
})
export class StudentClassModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => CourseModel)
  @Column({ field: "course_id" })
  courseId: string;

  @BelongsTo(() => CourseModel)
  course: CourseModel;

  @Column
  name: string;

  @Column
  active: boolean;

  @HasMany(() => EnrollmentModel)
  enrollments: EnrollmentModel[];

  @BelongsToMany(() => TeacherModel, () => StudentClassTeacherModel)
  teachers: TeacherModel[];

  @CreatedAt
  @Column({ field: "creation_date" })
  creationDate: Date;

  @UpdatedAt
  @Column({ field: "updated_on" })
  updatedOn: Date;

  toEntity(): StudentClass {
    const teacherIds = this.teachers?.map((teacher) => teacher.id);
    const enrollments = this.enrollments?.map(
      (enrollment) =>
        new Enrollment(
          enrollment.id,
          enrollment.studentClassId,
          enrollment.studentId
        )
    );
    return StudentClass.Builder.builder(this.id, this.courseId, this.name)
      .teacherIds(teacherIds)
      .enrollments(enrollments)
      .build();
  }
}

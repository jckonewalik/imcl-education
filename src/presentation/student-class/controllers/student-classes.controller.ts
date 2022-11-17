import { Page } from "@/domain/@shared/types/page";
import {
  FindCourseRepository,
  FindInCoursesRepository,
} from "@/domain/course/repository";
import { StudentClass } from "@/domain/student-class/entity";
import { FindAllStudentClassesRepository } from "@/domain/student-class/repository";
import { FindInStudentsRepository } from "@/domain/student/repository";
import { FindInTeachersRepository } from "@/domain/teacher/repository";
import { ApiPageResponseDto } from "@/presentation/@shared/decorators/api-page-response-dto";
import { ApiResponseDto } from "@/presentation/@shared/decorators/api-response-dto";
import { ErrorResponseDto } from "@/presentation/@shared/dto/error-response.dto";
import { ResponseDto } from "@/presentation/@shared/dto/response.dto";
import { GetStudentClassUseCase } from "@/usecases/student-class";
import { CreateStudentClassUseCase } from "@/usecases/student-class/create-student-class";
import { DeleteStudentClassUseCase } from "@/usecases/student-class/delete-student-class";
import { UpdateStudentClassUseCase } from "@/usecases/student-class/update-student-class";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  CreateStudentClassDto,
  SearchStudentClassDto,
  SimpleStudentClassDto,
  StudentClassDto,
  UpdateStudentClassDto,
} from "../dto";
@ApiTags("student-classes")
@Controller("student-classes")
export class StudentClassesController {
  constructor(
    private readonly createUseCase: CreateStudentClassUseCase,
    private readonly updateUseCase: UpdateStudentClassUseCase,
    private readonly getUseCase: GetStudentClassUseCase,
    private readonly deleteUseCase: DeleteStudentClassUseCase,
    @Inject("FindCourseRepository")
    private readonly findCourseRepo: FindCourseRepository,
    @Inject("FindInTeachersRepository")
    private readonly findInTeachersRepo: FindInTeachersRepository,
    @Inject("FindInStudentsRepository")
    private readonly findInStudentsRepo: FindInStudentsRepository,
    @Inject("FindAllStudentClassesRepository")
    private readonly findAllRepo: FindAllStudentClassesRepository,
    @Inject("FindInCoursesRepository")
    private readonly findInCoursesRepo: FindInCoursesRepository
  ) {}

  @Post()
  @ApiResponseDto(StudentClassDto, { status: 201 })
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateStudentClassDto
  ): Promise<ResponseDto<StudentClassDto>> {
    const studentClass = await this.createUseCase.create(dto);
    return new ResponseDto(
      HttpStatus.CREATED,
      await this.createStudentClassDto(studentClass)
    );
  }

  @Put(":studentClassId")
  @ApiResponseDto(StudentClassDto, { status: 200 })
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async update(
    @Param("studentClassId") studentClassId: string,
    @Body() dto: UpdateStudentClassDto
  ): Promise<ResponseDto<StudentClassDto>> {
    const studentClass = await this.updateUseCase.update({
      id: studentClassId,
      name: dto.name,
      year: dto.year,
      active: dto.active,
      students: dto.students,
      teachers: dto.teachers,
    });
    return new ResponseDto(
      HttpStatus.OK,
      await this.createStudentClassDto(studentClass)
    );
  }

  @Get(":studentClassId")
  @ApiResponseDto(StudentClassDto, { status: 200 })
  @ApiNotFoundResponse({
    status: 404,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async get(
    @Param("studentClassId") studentClassId: string
  ): Promise<ResponseDto<StudentClassDto>> {
    const studentClass = await this.getUseCase.get(studentClassId);
    return new ResponseDto(
      HttpStatus.OK,
      await this.createStudentClassDto(studentClass)
    );
  }

  @Delete(":studentClassId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
  })
  @ApiNotFoundResponse({
    status: 404,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async delete(@Param("studentClassId") studentClassId: string): Promise<void> {
    await this.deleteUseCase.delete(studentClassId);
  }

  private async createStudentClassDto(studentClass: StudentClass) {
    const course = await this.findCourseRepo.find(studentClass.courseId);
    const teachersIds = studentClass.teacherIds;
    const teachers = await this.findInTeachersRepo.find(teachersIds);

    const studentIds = studentClass.enrollments.map((e) => e.studentId);
    const students = await this.findInStudentsRepo.find(studentIds);

    return StudentClassDto.create(studentClass, course!, teachers, students);
  }

  @Post("search")
  @HttpCode(200)
  @ApiPageResponseDto(SimpleStudentClassDto)
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async search(
    @Body() dto: SearchStudentClassDto
  ): Promise<ResponseDto<Page<SimpleStudentClassDto>>> {
    const { page, lines, sortBy, sortOrder, ...criteria } = dto;
    const { currentPage, data, totalItems, totalPages } =
      await this.findAllRepo.find(criteria, sortBy, sortOrder, lines, page);

    const courseIds = [...new Set(data.map((s) => s.courseId))];
    const courses = await this.findInCoursesRepo.find(courseIds);

    return new ResponseDto(HttpStatus.OK, {
      currentPage,
      totalItems,
      totalPages,
      data: data.map((t) =>
        SimpleStudentClassDto.create(
          t,
          courses.find((c) => c.id === t.courseId)
        )
      ),
    });
  }
}

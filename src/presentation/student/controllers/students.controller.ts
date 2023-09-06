import { Page } from "@/domain/@shared/types/page";
import {
  FindCourseRepository,
  FindInCoursesRepository,
} from "@/domain/course/repository";
import {
  FindInStudentClassesRepository,
  FindStudentClassRepository,
} from "@/domain/student-class/repository";
import { Student } from "@/domain/student/entity";
import { FindAllStudentsRepository } from "@/domain/student/repository";
import { ApiPageResponseDto, ApiResponseDto } from "@/infra/decorators";
import { ErrorResponseDto } from "@/presentation/@shared/dto/error-response.dto";
import { ResponseDto } from "@/presentation/@shared/dto/response.dto";
import {
  DeleteStudentUseCase,
  GetStudentUseCase,
  RegisterStudentUseCase,
} from "@/usecases/student";
import { UpdateStudentUseCase } from "@/usecases/student/update-student";
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
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  CreateStudentDto,
  SearchStudentDto,
  SimpleStudentDto,
  UpdateStudentDto,
} from "../dto";
import { StudentDto } from "../dto/student.dto";

@ApiTags("students")
@Controller("students")
export class StudentsController {
  constructor(
    private readonly registerUseCase: RegisterStudentUseCase,
    private readonly updateUseCase: UpdateStudentUseCase,
    private readonly getUseCase: GetStudentUseCase,
    private readonly deleteUseCase: DeleteStudentUseCase,
    @Inject("FindAllStudentsRepository")
    private readonly findAllRepo: FindAllStudentsRepository,
    @Inject("FindStudentClassRepository")
    private readonly findStudentClassRepository: FindStudentClassRepository,
    @Inject("FindCourseRepository")
    private readonly findCourse: FindCourseRepository
  ) {}

  @Post()
  @ApiResponseDto(StudentDto, { status: 201 })
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "Bearer token para autenticação",
  })
  async create(
    @Body() dto: CreateStudentDto
  ): Promise<ResponseDto<StudentDto>> {
    const student = await this.registerUseCase.register({
      name: dto.name,
      gender: dto.gender,
      phone: dto.phone,
      studentClassId: dto.studentClassId,
    });
    return new ResponseDto(
      HttpStatus.CREATED,
      await this.createStudentDto(student)
    );
  }

  @Put(":studentId")
  @ApiResponseDto(StudentDto, { status: 200 })
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
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "Bearer token para autenticação",
  })
  async update(
    @Param("studentId") studentId: string,
    @Body() dto: UpdateStudentDto
  ): Promise<ResponseDto<StudentDto>> {
    const student = await this.updateUseCase.update({
      id: studentId,
      name: dto.name,
      phone: dto.phone,
      active: dto.active,
    });
    return new ResponseDto(HttpStatus.OK, await this.createStudentDto(student));
  }

  @Get(":studentId")
  @ApiResponseDto(StudentDto, { status: 200 })
  @ApiNotFoundResponse({
    status: 404,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "Bearer token para autenticação",
  })
  async get(
    @Param("studentId") studentId: string
  ): Promise<ResponseDto<StudentDto>> {
    const student = await this.getUseCase.get(studentId);
    return new ResponseDto(HttpStatus.OK, await this.createStudentDto(student));
  }

  @Post("search")
  @HttpCode(200)
  @ApiPageResponseDto(SimpleStudentDto)
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "Bearer token para autenticação",
  })
  async search(
    @Body() dto: SearchStudentDto
  ): Promise<ResponseDto<Page<SimpleStudentDto>>> {
    const { page, lines, sortBy, sortOrder, ...criteria } = dto;
    const { currentPage, data, totalItems, totalPages } =
      await this.findAllRepo.find(criteria, sortBy, sortOrder, lines, page);

    return new ResponseDto(HttpStatus.OK, {
      currentPage,
      totalItems,
      totalPages,
      data: data.map((t) => SimpleStudentDto.fromEntity(t)),
    });
  }

  @Delete(":studentId")
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
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "Bearer token para autenticação",
  })
  async delete(@Param("studentId") studentId: string): Promise<void> {
    await this.deleteUseCase.delete(studentId);
  }

  private async createStudentDto(student: Student) {
    const studentClass = await this.findStudentClassRepository.find(
      student.studentClassId
    );
    const course = await this.findCourse.find(studentClass!.courseId);
    return StudentDto.create(student, studentClass!, course!);
  }
}

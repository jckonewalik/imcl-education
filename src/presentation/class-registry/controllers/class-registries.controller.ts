import { ClassRegistry } from "@/domain/class-registry/entity";
import { FindCourseRepository } from "@/domain/course/repository";
import { FindStudentClassRepository } from "@/domain/student-class/repository";
import { FindInStudentsRepository } from "@/domain/student/repository";
import { FindTeacherRepository } from "@/domain/teacher/repository";
import { ApiResponseDto } from "@/presentation/@shared/decorators/api-response-dto";
import { ErrorResponseDto } from "@/presentation/@shared/dto/error-response.dto";
import { ResponseDto } from "@/presentation/@shared/dto/response.dto";
import { CreateClassRegistryUseCase } from "@/usecases/class-registry";
import { Body, Controller, HttpStatus, Inject, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from "@nestjs/swagger";
import moment from "moment";
import { ClassRegistryDto, CreateClassRegistryDto } from "../dto";
@ApiTags("class-registries")
@Controller("class-registries")
export class ClassRegistriesController {
  constructor(
    private readonly createUseCase: CreateClassRegistryUseCase,
    @Inject("FindStudentClassRepository")
    private readonly findStudentClassRepo: FindStudentClassRepository,
    @Inject("FindCourseRepository")
    private readonly findTeacherRepo: FindTeacherRepository,
    @Inject("FindCourseRepository")
    private readonly findCourseRepo: FindCourseRepository,
    @Inject("FindInStudentsRepository")
    private readonly findInStudentsRepo: FindInStudentsRepository
  ) {}

  @Post()
  @ApiResponseDto(ClassRegistryDto, { status: 201 })
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateClassRegistryDto
  ): Promise<ResponseDto<ClassRegistryDto>> {
    const registry = await this.createUseCase.create({
      ...dto,
      date: moment(dto.date).toDate(),
    });
    return new ResponseDto(
      HttpStatus.CREATED,
      await this.createClassRegistryDto(registry)
    );
  }

  private async createClassRegistryDto(registry: ClassRegistry) {
    const studentClass = await this.findStudentClassRepo.find(
      registry.studentClassId
    );
    const course = await this.findCourseRepo.find(studentClass?.courseId!);
    const teacher = await this.findTeacherRepo.find(registry.teacherId);

    const students = await this.findInStudentsRepo.find(registry.studentIds);

    return ClassRegistryDto.create(
      registry,
      studentClass,
      teacher,
      course,
      students
    );
  }
}

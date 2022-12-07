import { DateUtils } from "@/domain/@shared/util/date-utils";
import { ClassRegistry } from "@/domain/class-registry/entity";
import { FindClassRegitryByDateRepository } from "@/domain/class-registry/repository";
import { FindCourseRepository } from "@/domain/course/repository";
import { FindStudentClassRepository } from "@/domain/student-class/repository";
import { FindInStudentsRepository } from "@/domain/student/repository";
import { FindTeacherRepository } from "@/domain/teacher/repository";
import { ApiResponseDto } from "@/presentation/@shared/decorators/api-response-dto";
import { ErrorResponseDto } from "@/presentation/@shared/dto/error-response.dto";
import { ResponseDto } from "@/presentation/@shared/dto/response.dto";
import {
  CreateClassRegistryUseCase,
  UpdateClassRegistryUseCase,
} from "@/usecases/class-registry";
import { DeleteClassRegistryUseCase } from "@/usecases/class-registry/delete-class-registry";
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
  Query,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import moment from "moment";
import {
  ClassRegistryDto,
  CreateClassRegistryDto,
  UpdateClassRegistryDto,
} from "../dto";
@ApiTags("class-registries")
@Controller("class-registries")
export class ClassRegistriesController {
  constructor(
    private readonly createUseCase: CreateClassRegistryUseCase,
    private readonly updateUseCase: UpdateClassRegistryUseCase,
    private readonly deleteUseCase: DeleteClassRegistryUseCase,
    @Inject("FindStudentClassRepository")
    private readonly findStudentClassRepo: FindStudentClassRepository,
    @Inject("FindTeacherRepository")
    private readonly findTeacherRepo: FindTeacherRepository,
    @Inject("FindCourseRepository")
    private readonly findCourseRepo: FindCourseRepository,
    @Inject("FindInStudentsRepository")
    private readonly findInStudentsRepo: FindInStudentsRepository,
    @Inject("FindClassRegitryByDateRepository")
    private readonly findRegistryByDate: FindClassRegitryByDateRepository
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
  ): Promise<ResponseDto<ClassRegistryDto | undefined>> {
    const registry = await this.createUseCase.create({
      ...dto,
      date: moment(dto.date).toDate(),
    });
    return new ResponseDto(
      HttpStatus.CREATED,
      await this.createClassRegistryDto(registry)
    );
  }

  @Put(":classRegistryId")
  @ApiResponseDto(ClassRegistryDto, { status: 200 })
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async update(
    @Param("classRegistryId") classRegistryId: string,
    @Body() dto: UpdateClassRegistryDto
  ): Promise<ResponseDto<ClassRegistryDto | undefined>> {
    const registry = await this.updateUseCase.update({
      ...dto,
      id: classRegistryId,
      date: moment(dto.date).toDate(),
    });
    return new ResponseDto(
      HttpStatus.OK,
      await this.createClassRegistryDto(registry)
    );
  }

  @Delete(":classRegistryId")
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
  async delete(
    @Param("classRegistryId") classRegistryId: string
  ): Promise<void> {
    await this.deleteUseCase.delete(classRegistryId);
  }

  @Get()
  @ApiResponseDto(ClassRegistryDto, { status: 200 })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async find(
    @Query("studentClassId") studentClassId: string,
    @Query("date") date: string
  ): Promise<ResponseDto<ClassRegistryDto | undefined>> {
    const searchDate = DateUtils.fromString(date);
    const registry = await this.findRegistryByDate.find(
      studentClassId,
      searchDate
    );
    return new ResponseDto(
      HttpStatus.OK,
      await this.createClassRegistryDto(registry)
    );
  }

  private async createClassRegistryDto(registry?: ClassRegistry) {
    if (!registry) {
      return;
    }
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

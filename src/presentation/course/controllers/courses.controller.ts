import { Page } from "@/domain/@shared/types/page";
import { FindAllCoursesRepository } from "@/domain/course/repository";
import { ApiPageResponseDto, ApiResponseDto } from "@/infra/decorators";
import { ErrorResponseDto } from "@/presentation/@shared/dto/error-response.dto";
import { ResponseDto } from "@/presentation/@shared/dto/response.dto";
import CreateCourseUseCase from "@/usecases/course/create-course";
import { DeleteCourseUseCase } from "@/usecases/course/delete-course";
import { GetCourseUseCase } from "@/usecases/course/get-course";
import { UpdateCourseUseCase } from "@/usecases/course/update-course";
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
  CourseDto,
  CreateCourseDto,
  SearchCourseDto,
  SimpleCourseDto,
} from "../dto";
import { UpdateCourseDto } from "../dto/update-course.dto";

@ApiTags("courses")
@Controller("courses")
export class CoursesController {
  constructor(
    private readonly createUseCase: CreateCourseUseCase,
    private readonly updateUseCase: UpdateCourseUseCase,
    private readonly getUseCase: GetCourseUseCase,
    private readonly deleteUseCase: DeleteCourseUseCase,
    @Inject("FindAllCoursesRepository")
    private readonly findAllRepo: FindAllCoursesRepository
  ) {}
  @Post()
  @ApiResponseDto(CourseDto, { status: 201 })
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
  async create(@Body() dto: CreateCourseDto): Promise<ResponseDto<CourseDto>> {
    const course = await this.createUseCase.create({ name: dto.name });
    return new ResponseDto(HttpStatus.CREATED, CourseDto.fromEntity(course));
  }

  @Put(":courseId")
  @ApiResponseDto(CourseDto, { status: 200 })
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
    @Param("courseId") courseId: string,
    @Body() dto: UpdateCourseDto
  ): Promise<ResponseDto<CourseDto>> {
    const course = await this.updateUseCase.update({
      id: courseId,
      name: dto.name,
      active: dto.active,
      lessons: dto.lessons,
    });
    return new ResponseDto(HttpStatus.OK, CourseDto.fromEntity(course));
  }

  @Get(":courseId")
  @ApiResponseDto(CourseDto, { status: 200 })
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
    @Param("courseId") courseId: string
  ): Promise<ResponseDto<CourseDto>> {
    const course = await this.getUseCase.get(courseId);
    return new ResponseDto(HttpStatus.OK, CourseDto.fromEntity(course));
  }

  @Post("search")
  @HttpCode(200)
  @ApiPageResponseDto(SimpleCourseDto)
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
    @Body() dto: SearchCourseDto
  ): Promise<ResponseDto<Page<SimpleCourseDto>>> {
    const { page, lines, sortBy, sortOrder, ...criteria } = dto;
    const { currentPage, data, totalItems, totalPages } =
      await this.findAllRepo.find(criteria, sortBy, sortOrder, lines, page);

    return new ResponseDto(HttpStatus.OK, {
      currentPage,
      totalItems,
      totalPages,
      data: data.map((t) => SimpleCourseDto.fromEntity(t)),
    });
  }

  @Delete(":courseId")
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
  async delete(@Param("courseId") courseId: string): Promise<void> {
    await this.deleteUseCase.delete(courseId);
  }
}

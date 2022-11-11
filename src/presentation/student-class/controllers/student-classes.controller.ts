import { FindCourseRepository } from "@/domain/course/repository";
import { ApiResponseDto } from "@/presentation/@shared/decorators/api-response-dto";
import { ErrorResponseDto } from "@/presentation/@shared/dto/error-response.dto";
import { ResponseDto } from "@/presentation/@shared/dto/response.dto";
import { CreateStudentClassUseCase } from "@/usecases/student-class/create-student-class";
import { Body, Controller, HttpStatus, Inject, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateStudentClassDto, StudentClassDto } from "../dto";
@ApiTags("student-classes")
@Controller("student-classes")
export class StudentClassesController {
  constructor(
    private readonly createUseCase: CreateStudentClassUseCase,
    @Inject("FindCourseRepository")
    private readonly findCourseRepo: FindCourseRepository
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
    const course = await this.findCourseRepo.find(dto.courseId);
    return new ResponseDto(
      HttpStatus.CREATED,
      StudentClassDto.create(studentClass, course!)
    );
  }
}

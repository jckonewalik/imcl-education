import { FindCourseRepository } from "@/domain/course/repository";
import { ApiResponseDto } from "@/presentation/@shared/decorators/api-response-dto";
import { ErrorResponseDto } from "@/presentation/@shared/dto/error-response.dto";
import { ResponseDto } from "@/presentation/@shared/dto/response.dto";
import { CreateStudentClassUseCase } from "@/usecases/student-class/create-student-class";
import { UpdateStudentClassUseCase } from "@/usecases/student-class/update-student-class";
import {
  Body,
  Controller,
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
  ApiTags,
} from "@nestjs/swagger";
import {
  CreateStudentClassDto,
  StudentClassDto,
  UpdateStudentClassDto,
} from "../dto";
@ApiTags("student-classes")
@Controller("student-classes")
export class StudentClassesController {
  constructor(
    private readonly createUseCase: CreateStudentClassUseCase,
    private readonly updateUseCase: UpdateStudentClassUseCase,
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
      active: dto.active,
      students: dto.students,
      teachers: dto.teachers,
    });
    const course = await this.findCourseRepo.find(studentClass.courseId);
    return new ResponseDto(
      HttpStatus.OK,
      StudentClassDto.create(studentClass, course!)
    );
  }
}

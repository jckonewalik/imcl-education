import { ApiResponseDto } from "@/presentation/@shared/decorators/api-response-dto";
import { ErrorResponseDto } from "@/presentation/@shared/dto/error-response.dto";
import { ResponseDto } from "@/presentation/@shared/dto/response.dto";
import { GetStudentUseCase, RegisterStudentUseCase } from "@/usecases/student";
import { UpdateStudentUseCase } from "@/usecases/student/update-student";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
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
import { CreateStudentDto, UpdateStudentDto } from "../dto";
import { StudentDto } from "../dto/student.dto";

@ApiTags("students")
@Controller("students")
export class StudentsController {
  constructor(
    private readonly registerUseCase: RegisterStudentUseCase,
    private readonly updateUseCase: UpdateStudentUseCase,
    private readonly getUseCase: GetStudentUseCase
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
  async create(
    @Body() dto: CreateStudentDto
  ): Promise<ResponseDto<StudentDto>> {
    const student = await this.registerUseCase.register({
      name: dto.name,
      gender: dto.gender,
      phone: dto.phone,
    });
    return new ResponseDto(HttpStatus.CREATED, StudentDto.fromEntity(student));
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
    return new ResponseDto(HttpStatus.OK, StudentDto.fromEntity(student));
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
  async get(
    @Param("studentId") studentId: string
  ): Promise<ResponseDto<StudentDto>> {
    const student = await this.getUseCase.get(studentId);
    return new ResponseDto(HttpStatus.OK, StudentDto.fromEntity(student));
  }
}

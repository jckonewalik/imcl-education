import { Page } from "@/domain/@shared/types/page";
import { FindAllTeachersRepository } from "@/domain/teacher/repository";
import { ApiPageResponseDto } from "@/presentation/@shared/decorators/api-page-response-dto";
import { ApiResponseDto } from "@/presentation/@shared/decorators/api-response-dto";
import { ErrorResponseDto } from "@/presentation/@shared/dto/error-response.dto";
import { ResponseDto } from "@/presentation/@shared/dto/response.dto";
import { CreateTeacherDto, TeacherDto } from "@/presentation/teacher/dto";
import {
  RegisterTeacherUseCase,
  UpdateTeacherUseCase,
} from "@/usecases/teacher";
import { GetTeacherUseCase } from "@/usecases/teacher/get-teacher";
import {
  Body,
  Controller,
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
  ApiTags,
} from "@nestjs/swagger";
import { SearchTeacherDto } from "../dto/search-teacher.dto";
import { SimpleTeacherDto } from "../dto/simple-teacher.dto";
import { UpdateTeacherDto } from "../dto/update-teacher.dto";

@ApiTags("teachers")
@Controller("teachers")
export class TeachersController {
  constructor(
    private readonly registerUseCase: RegisterTeacherUseCase,
    private readonly updateUseCase: UpdateTeacherUseCase,
    private readonly getUseCase: GetTeacherUseCase,
    @Inject("FindAllTeachersRepository")
    private readonly findAllRepo: FindAllTeachersRepository
  ) {}
  @Post()
  @ApiResponseDto(TeacherDto, { status: 201 })
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateTeacherDto
  ): Promise<ResponseDto<TeacherDto>> {
    const teacher = await this.registerUseCase.register(dto);
    return new ResponseDto(HttpStatus.CREATED, TeacherDto.fromEntity(teacher));
  }

  @Put(":teacherId")
  @ApiResponseDto(TeacherDto, { status: 200 })
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async update(
    @Param("teacherId") teacherId: string,
    @Body() dto: UpdateTeacherDto
  ): Promise<ResponseDto<TeacherDto>> {
    const teacher = await this.updateUseCase.update({
      id: teacherId,
      name: dto.name,
      email: dto.email,
      active: dto.active,
    });
    return new ResponseDto(HttpStatus.OK, TeacherDto.fromEntity(teacher));
  }

  @Get(":teacherId")
  @ApiResponseDto(TeacherDto, { status: 200 })
  @ApiNotFoundResponse({
    status: 404,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async get(
    @Param("teacherId") teacherId: string
  ): Promise<ResponseDto<TeacherDto>> {
    const teacher = await this.getUseCase.get(teacherId);
    return new ResponseDto(HttpStatus.OK, TeacherDto.fromEntity(teacher));
  }

  @Post("search")
  @HttpCode(200)
  @ApiPageResponseDto(SimpleTeacherDto)
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async search(
    @Body() dto: SearchTeacherDto
  ): Promise<ResponseDto<Page<SimpleTeacherDto>>> {
    const { page, lines, ...criteria } = dto;
    const { currentPage, data, totalItems, totalPages } =
      await this.findAllRepo.find(criteria, lines, page);

    return new ResponseDto(HttpStatus.OK, {
      currentPage,
      totalItems,
      totalPages,
      data: data.map((t) => SimpleTeacherDto.fromEntity(t)),
    });
  }
}

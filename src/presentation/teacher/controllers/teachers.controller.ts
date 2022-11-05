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
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { UpdateTeacherDto } from "../dto/update-teacher.dto";

@Controller("teachers")
export class TeachersController {
  constructor(
    private readonly registerUseCase: RegisterTeacherUseCase,
    private readonly updateUseCase: UpdateTeacherUseCase,
    private readonly getUseCase: GetTeacherUseCase
  ) {}
  @Post()
  async create(
    @Body() dto: CreateTeacherDto
  ): Promise<ResponseDto<TeacherDto>> {
    const teacher = await this.registerUseCase.register(dto);
    return new ResponseDto(HttpStatus.CREATED, TeacherDto.fromEntity(teacher));
  }

  @Put(":teacherId")
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
  async get(
    @Param("teacherId") teacherId: string
  ): Promise<ResponseDto<TeacherDto>> {
    const teacher = await this.getUseCase.get(teacherId);
    return new ResponseDto(HttpStatus.OK, TeacherDto.fromEntity(teacher));
  }
}

import { ResponseDto } from "@/presentation/@shared/dto/response.dto";
import { CreateTeacherDto, TeacherDto } from "@/presentation/teacher/dto";
import { RegisterTeacherUseCase } from "@/usecases/teacher";
import { Body, Controller, HttpStatus, Post } from "@nestjs/common";

@Controller("teachers")
export class TeachersController {
  constructor(private readonly registerUseCase: RegisterTeacherUseCase) {}
  @Post()
  async create(
    @Body() dto: CreateTeacherDto
  ): Promise<ResponseDto<TeacherDto>> {
    const teacher = await this.registerUseCase.register(dto);
    return new ResponseDto(HttpStatus.CREATED, TeacherDto.fromEntity(teacher));
  }
}

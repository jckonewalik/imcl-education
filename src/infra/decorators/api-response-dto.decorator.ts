import { applyDecorators } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from "@nestjs/swagger";
import { BaseDto } from "../../presentation/@shared/dto/base.dto";
import { ResponseDto } from "../../presentation/@shared/dto/response.dto";

export const ApiResponseDto = <DataDto extends typeof BaseDto>(
  dataDto: DataDto,
  options?: ApiResponseOptions
) =>
  applyDecorators(
    ApiExtraModels(ResponseDto, dataDto),
    ApiResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              body: { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    })
  );

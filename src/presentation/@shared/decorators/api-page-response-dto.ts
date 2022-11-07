import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { BaseDto } from "../dto/base.dto";
import { PageResponseDto } from "../dto/page-response.dto";
import { ResponseDto } from "../dto/response.dto";

export const ApiPageResponseDto = <DataDto extends typeof BaseDto>(
  dataDto: DataDto
) =>
  applyDecorators(
    ApiExtraModels(PageResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              body: {
                allOf: [
                  { $ref: getSchemaPath(PageResponseDto) },
                  {
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: getSchemaPath(dataDto),
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    })
  );

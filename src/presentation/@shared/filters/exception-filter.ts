import {
  BadRequestException as CustomBadRequestException,
  EntityNotFoundException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus;
    let message;
    if (
      exception instanceof CustomBadRequestException ||
      exception instanceof InvalidValueException
    ) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof EntityNotFoundException) {
      httpStatus = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof BadRequestException) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = exception.getResponse()["message"][0];
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message:
        httpStatus === HttpStatus.INTERNAL_SERVER_ERROR
          ? Messages.SOMETHING_WRONG_HAPPEND
          : message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

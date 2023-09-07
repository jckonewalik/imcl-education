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
  ForbiddenException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger(AllExceptionsFilter.name);
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
    } else if (exception instanceof UnauthorizedException) {
      httpStatus = HttpStatus.UNAUTHORIZED;
      message = Messages.UNAUTHORIZED_USER;
    } else if (exception instanceof ForbiddenException) {
      httpStatus = HttpStatus.FORBIDDEN;
      message = Messages.FORBIDDEN_RESOURCE;
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = Messages.SOMETHING_WRONG_HAPPEND;
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message,
    };

    this.logger.log(responseBody, exception);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

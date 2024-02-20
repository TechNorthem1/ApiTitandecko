import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

export class AllExceptionFilter implements ExceptionFilter {
    // definiendo logger 
    private logger = new Logger(AllExceptionFilter.name);

    // sobreescribiendo metodo catch
    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response =  context.getResponse();
        const request = context.getRequest();
        const status = exception instanceof HttpException? exception.getStatus() : HttpStatus.NOT_FOUND;
        const message = exception instanceof HttpException? exception.getResponse() : exception;
        this.logger.error(`Status: ${status}, Error: ${JSON.stringify(message)}`);

        response.status(status).json({
            timestamp: new Date().toISOString(),
            path: request.url,
            error: message,
        });
    }

}
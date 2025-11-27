import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
    private readonly logger = new Logger('Performance');
    private readonly slowQueryThreshold = 1000; // 1 second

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const startTime = Date.now();
        const contextType = context.getType<'http' | 'graphql'>();

        let operationName = 'unknown';
        let operationType = contextType;

        if (contextType === 'graphql') {
            const gqlContext = GqlExecutionContext.create(context);
            const info = gqlContext.getInfo();
            operationName = info?.fieldName || 'unknown';
            operationType = info?.operation?.operation || 'query';
        } else if (contextType === 'http') {
            const httpContext = context.switchToHttp();
            const request = httpContext.getRequest();
            operationName = `${request.method} ${request.url}`;
        }

        return next.handle().pipe(
            tap({
                next: () => {
                    const duration = Date.now() - startTime;

                    if (duration >= this.slowQueryThreshold) {
                        this.logger.warn(
                            `⚠️  SLOW ${operationType.toUpperCase()}: ${operationName} took ${duration}ms`,
                        );
                    } else if (duration >= 500) {
                        this.logger.log(
                            `⏱️  ${operationType.toUpperCase()}: ${operationName} took ${duration}ms`,
                        );
                    }
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    this.logger.error(
                        `❌ FAILED ${operationType.toUpperCase()}: ${operationName} took ${duration}ms - ${error.message}`,
                    );
                },
            }),
        );
    }
}

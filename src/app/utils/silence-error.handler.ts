import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, SchedulerLike, throwError } from 'rxjs';

/**
 * 静默错误消息类
 */
export class SilenceError {
  constructor(error: any) {
    if (error instanceof Error) {
      Object.assign(this, {
        ...error,
        name: error.name,
        message: error.message,
      });
    } else if (error instanceof HttpErrorResponse) {
      Object.assign(this, {
        ...error,
        name: error.name || 'SilenceError',
        message: (error.error && error.error.message) || error.statusText || 'Error',
      });
    } else if (typeof error !== 'object' || error instanceof String) {
      Object.assign(this, {
        name: 'SilenceError',
        message: error + '',
      });
    } else {
      Object.assign(this, error);
    }
  }

  ngErrorLogger(console: Console, ...values: any[]): void {
    if (!environment.production) {
      (console as any).info(...values);
    }
  }
}

/**
 * Creates an Observable that emits no items to the Observer and immediately
 * emits an info notification.
 * @param error -
 * @param scheduler -
 */
export function throwSilenceError(error: any, scheduler?: SchedulerLike): Observable<never> {
  return throwError.apply(this, [new SilenceError(error)].concat([].slice.call(arguments, 1)));
}

/**
 * 静默错误消息处理器
 */
@Injectable()
export class SilenceErrorHandler extends ErrorHandler {
  handleError(error: any) {
    if (!(error instanceof SilenceError)) {
      // Make sure to rethrow the error so Angular can pick it up
      super.handleError(error);
    } else {
      error.ngErrorLogger(console, `ERROR`, error);
    }
  }
}

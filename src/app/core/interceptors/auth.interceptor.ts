import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    originalReq: HttpRequest<any>,
    nextHandler: HttpHandler
  ): Observable<HttpEvent<any>> {
    const savedToken = localStorage.getItem('token');

    if (!savedToken) {
      return nextHandler.handle(originalReq);
    }

    const authReq = originalReq.clone({
      headers: originalReq.headers.set('Authorization', savedToken),
    });

    return nextHandler.handle(authReq);
  }
}

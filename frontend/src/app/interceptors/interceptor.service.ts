import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import { StoreService } from '../services/store.service';

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {

    constructor(private store: StoreService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      let token = localStorage.getItem('token')

      if(token) {
        request = request.clone({
          setHeaders: {Authorization: `Bearer ${token}`}
        })

      }

        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMsg = '';
                    if (error.error instanceof ErrorEvent) {
                        errorMsg = `${error.error.message}`;
                    } else {
                        errorMsg = `${error.error.message}`;
                    }
                    this.store.setflashMessage(errorMsg);
                    return throwError(errorMsg);
                })
            )
    }
}

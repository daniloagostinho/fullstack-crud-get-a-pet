import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorCatchingInterceptor } from './interceptor.service';

@NgModule({
 providers: [
  ErrorCatchingInterceptor,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorCatchingInterceptor,
    multi: true,
  },
 ],
})
export class InterceptorModule {}

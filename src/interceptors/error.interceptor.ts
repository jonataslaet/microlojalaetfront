import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {


  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
      console.log("Passou pelo interceptor");
      return next.handle(req)
      .catch((error, caught) => {

        let erro = error;
        if (erro.error){
            erro = erro.error;
        }
        if (!erro.status){
            erro = JSON.parse(erro);
        }

        console.log("Erro detectado pelo interceptor");
        console.log(erro);

         return Observable.throw(erro);   
      }) as any;
  }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};

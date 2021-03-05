import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService){

    }

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

            switch(erro.status){
                case 403:
                    this.handleErro403();
                break;
            }

            return Observable.throw(erro);   
        }) as any;
    }

    handleErro403(){
        this.storage.setLocalUser(null);
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};

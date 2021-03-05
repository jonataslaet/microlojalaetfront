import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { StorageService } from '../services/storage.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
        let lengthBaseUrl = API_CONFIG.baseUrl.length;
        let isReqToAPI = req.url.substring(0, lengthBaseUrl) == API_CONFIG.baseUrl;
        let localUser = this.storage.getLocalUser();
        if (localUser && isReqToAPI){
            const authReq = req.clone({headers:req.headers.set('Authorization','Bearer '+localUser.token)});
            return next.handle(authReq);
        }   

        return next.handle(req)
    }
}

export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
};

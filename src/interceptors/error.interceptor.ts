import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { CustomFieldError } from '../models/customfielderror';
import { StorageService } from '../services/storage.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public alertCtrl: AlertController){

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

                case 401:
                    this.handleErro401();
                break;

                case 403:
                    this.handleErro403();
                break;

                case 422:
                    this.handleErro422(erro);
                break;

                default:
                    this.handleDefaultErro(erro);
                break;
            }

            return Observable.throw(erro);   
        }) as any;
    }

    handleErro401(){
        let alert = this.alertCtrl.create({
            title: 'Error 401: Falha na Autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handleErro403(){
        this.storage.setLocalUser(null);
    }

    handleDefaultErro(erro){
        let alert = this.alertCtrl.create({
            title: 'Error '+erro.status+': '+erro.error,
            message: erro.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handleErro422(erro){
        let alert = this.alertCtrl.create({
           title: 'Erro 422: Erro de Validação',
            message: this.listErrors(erro.errors),
           enableBackdropDismiss: false,
           buttons: [
               {
                   text: 'Ok'
               }
           ]
       });
       alert.present();
   }

    private listErrors(messages : CustomFieldError[]) : string {
        let s : string = '';
        
        for(var i = 0; i < messages.length; i++){
            s = s + '<p><strong>'+messages[i].nome+"</strong>:" + messages[i].message + '</p>';
        }

        return s;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};

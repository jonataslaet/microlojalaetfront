import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { StorageService } from "./storage.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { LocalUser } from "../models/local_user";

@Injectable()
export class AuthService {

    jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(public http: HttpClient, public storage: StorageService){

    }
    

    authenticate(creds: CredenciaisDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`, 
            creds,
            {
               observe: 'response' ,
               responseType: 'text'
            }
        );
    }

    successfulLogin(authorizationValue : string){
        console.log("Login efetuado com sucesso");
        let tokenSemBearer = authorizationValue.substring(7);
        let user: LocalUser = {
            token: tokenSemBearer,
            email: this.jwtHelper.decodeToken(tokenSemBearer).sub
        };
        console.log(user);
        this.storage.setLocalUser(user);
    }

    refreshToken(){
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`, 
            {},
            {
               observe: 'response' ,
               responseType: 'text'
            }
        );
    }

    logout(){
        this.storage.setLocalUser(null);
    }
}
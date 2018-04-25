import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";


@Injectable()
export class AuthPrincipalService {

    private authenticated = false;

    constructor(
        private authService:AuthService
    ){}

    identity(status?:boolean): boolean {

        if(status){
            this.authenticated = true;
        }else{
            //cek sudah login atau blm
            if (this.authService.getToken() !== null){
                this.authenticated = true;
            }else{
                this.authenticated = false;
            }
        }

        return this.authenticated;

    }

    isAuthenticated(): boolean{
        return this.authenticated;
    }
}
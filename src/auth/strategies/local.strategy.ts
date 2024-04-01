import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){

    constructor(private readonly authService:AuthService){
        super();
    }

    async validate(email:string, password:string):Promise<any>{
        const auth = await this.authService.validateAuth(email, password);
        if(!auth){
            return {
                // status: "UNAUTHORIZED",
                // message: "Credenciales invalidas"
            }
            // throw new HttpException("Credenciales invalidas", HttpStatus.UNAUTHORIZED); 
        }
        return auth;
    }
}

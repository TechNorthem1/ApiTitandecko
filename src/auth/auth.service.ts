import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAuth } from 'src/common/interfaces/auth.interface';
import { AUTH, USERS } from 'src/common/models/models';
import { AuthDTO } from './dto/auth.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import * as bcrypt from "bcrypt";
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AllExceptionFilter } from 'src/common/filters/httpException.filter';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(AUTH.name) private readonly model:Model<IAuth>, 
        @InjectModel(USERS.name) private readonly modelU:Model<IUser>,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async validatePassword(password:string, passwordBD:string):Promise<boolean> {
        return await bcrypt.compare(password, passwordBD);
    }

    async validateAuth(email: string, password: string): Promise<any>{
        try{
            const auth = await this.model.findOne({email:email});
            const isValidPassword = await this.validatePassword(password, auth.password);
            return (auth && isValidPassword) ? auth : null;
        }catch(e){
            throw new HttpException(
                "Credenciales invalidas",
                HttpStatus.NOT_FOUND
            )
        }
    }

    async hashPassword(password: string): Promise<any> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async create(authDTO:AuthDTO): Promise<any> {
        try{
            const authFind = await this.model.findOne({email: authDTO.email});
            if(authFind){
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: "El usuario ya existe"
                }
            }
            let hash = await this.hashPassword(authDTO.password);
            let auth = new this.model({...authDTO, password: hash});
            auth.save();
            let user = new this.modelU({...authDTO, auth});
            return this.userService.create(user);
        }catch(error) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: "Se ha generado un error"
            }
        }
    }

    async singIn(req: any):Promise<any>{
        try{
        
            const { email } = req.user;
            
            const auth = await this.model.findOne({email: email});
            const client = await this.userService.findUserByAuth(auth);
            const {_id, name, lastname, phone} = client;
            const payload = {
                _id,
                name,
                lastname,
                phone,
            }

            return {
                access_token: this.jwtService.sign(payload),
                client
            }
        }catch(error){
            throw new HttpException (
                "Credenciales incorrectas",
                HttpStatus.BAD_REQUEST,
            )
        }

    }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/common/interfaces/user.interface';
import { USERS } from 'src/common/models/models';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(USERS.name) private readonly model:Model<IUser>){}

    async create(userDTO:UserDTO):Promise<any>{
        try {
            const user = new this.model(userDTO);
            user.save();
            return {
                status: HttpStatus.CREATED,
                message: "Usuario registrado correctamente",
                user
            }
        } catch (error) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: "Se ha genereado un error"
            }
        }
    }

    async findOne(id:string):Promise<any>{
        try {
            const user = await this.model.findById(id).populate("auth", "-password -createdAt -updatedAt -__v");
            return {
                status: HttpStatus.OK,
                message: "informacion del usuario",
                user
            }
        } catch (error) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: "El usuario no existe",
            }
        }
    }

    async update(id: string, userDTO:UserDTO):Promise<any>{
        try {
            const user = await this.model.findByIdAndUpdate(id, userDTO, {new:true});
            return {
                status: HttpStatus.OK,
                message: "Datos del usuario actualizados correctamente",
                user
            }
        } catch (error) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: "Ha ocurrido un error al actualizar datos"
            }
        }
    }

    async delete(id:string):Promise<any>{
        await this.model.findByIdAndDelete(id);
        return {
            status: HttpStatus.NO_CONTENT,
            message: "Usuario eliminado correctamente",
        }
    }

    async findUserByAuth(auth:any) {
        return await this.model.findOne({auth: auth._id})
          .populate("auth")
          .select("-__v -createdAt -updatedAt")
    }
}
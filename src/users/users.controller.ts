import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags("Usuarios")
@Controller('api/v1/users')
export class UsersController {
    constructor(private readonly userService:UsersService){}

    @Post()
    @ApiOperation({summary: "crear un usuario"})
    create(@Body() userDTO:UserDTO) {
        return this.userService.create(userDTO);
    }

    @Get(":id")
    @ApiOperation({summary: "Obtener un usuario por id"})
    findOne(@Param("id") id:string) {
        return this.userService.findOne(id);
    }

    @Put(":id")
    @ApiOperation({summary: "actualizar los datos del usuario por id"})
    update(@Param("id") id:string, @Body() userDTO:UserDTO){
        return this.userService.update(id, userDTO);
    }

    @Delete(":id")
    @ApiOperation({summary: "eliminar al usuairo por id"})
    delete(@Param("id") id:string) {
        return this.userService.delete(id);
    }
}

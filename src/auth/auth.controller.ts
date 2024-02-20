import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';


@ApiTags("Autenticacion")
@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}


    @Post("singup")
    @ApiOperation({summary: "Registrarse"})
    singup(@Body() authDTO:AuthDTO){
        return this.authService.create(authDTO);
    }
    
    @ApiOperation({summary: "iniciar sesion"})
    @UseGuards(LocalAuthGuard)
    @Post("singin")
    singIn(@Req() req:any){
        return this.authService.singIn(req);
    }
}
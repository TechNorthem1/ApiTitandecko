import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@ApiTags("Locaciones")
@Controller('api/v1/locations')
export class LocationsController {
    constructor(private readonly locationService: LocationsService){}

    @Get("departaments")
    departaments(){
        return this.locationService.departaments();
    }

    @Get("municipalities/:id")
    municipalities(@Param("id") id:string){
        return this.locationService.municipalities(id);
    }
}

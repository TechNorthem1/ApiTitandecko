import { Body, Controller, Delete, Get, Param, Post, Req, Res} from '@nestjs/common';
import { OrderDTO } from './dto/orders.dto';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IPreferenceItems } from 'src/common/interfaces/preferenceItems.interface';
import MercadoPagoConfig, { Payment, PaymentMethod } from 'mercadopago';
import { Response } from 'express';

@ApiTags("ordenes")
@Controller('api/v1/orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService){}

    @Post()
    @ApiOperation({summary: "generar orden"})
    create(@Body() orderDTO:OrderDTO){
        return this.orderService.create(orderDTO);
    }


    @Get()
    @ApiOperation({summary: "listar todas las ordenes"})
    findAll(){
        return this.orderService.findAll();
    }


    @Get(":id")
    @ApiOperation({summary: "Obtener orden por el id"})
    findOne(@Param("id") id: string){
        return this.orderService.findOne(id);
    }

    @Delete(":id")
    @ApiOperation({summary: "Eliminar orden por el id"})
    delete(@Param("id") id: string){
        return this.orderService.delete(id);
    }

    @Post("preference")
    genereatePreference(@Body() data:any){
        return this.orderService.preference(data);
    }
    
    @Post("payment")
    create_payment(@Req() req: Request, @Body() data:any){
        return this.orderService.create_payment(req, data);
    }

    @Get("google/feed")
    async feed(@Res() response:Response){
        try {
            let products = await this.orderService.getAllProducts();
            const xml = await this.orderService.getProductXml(products);
            response.setHeader('Content-Type', 'application/xml');
            response.send(xml);
        } catch (error) {
            console.error('Error al generar el feed XML:', error);
            response.status(500).send('Error interno del servidor');
        }
    } 

    @Get("google/feed/download")
    async download(@Res() response:Response){
        try {
            let products = await this.orderService.getAllProducts();
            const xml = await this.orderService.getProductXml(products);
            response.setHeader('Content-Type', 'application/xml');
            response.setHeader('Content-Disposition', 'attachment; filename="productos.xml"');
            response.send(xml);
        } catch (error) {
            console.error('Error al generar el feed XML:', error);
            response.status(500).send('Error interno del servidor');
        }
    }   

    @Post("cart/cart-abandoment")
    cartAbandoment(@Body() data: any){
        return this.orderService.cart_abandoment(data);
    }
    
}

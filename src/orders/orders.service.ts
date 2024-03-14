import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrder } from 'src/common/interfaces/order.interface';
import { ORDERS } from 'src/common/models/models';
import { OrderDTO } from './dto/orders.dto';
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';
import { IPreferenceItems } from 'src/common/interfaces/preferenceItems.interface';
import { Response } from 'express';
import { CartItem } from 'src/common/interfaces/cart.interface';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as xmlbuilder from 'xmlbuilder';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(ORDERS.name) private readonly model:Model<IOrder>){}

    async create(orderDTO: OrderDTO):Promise<any>{
        try {
            const order = new this.model(orderDTO);
            let {status, paid} = this.validateStatus(order.status);
            
            // order.status = status;
            order.set_paid = false;

            let { id } = await this.sendOrder(order);
            
            if(!id){
                throw new HttpException("orden no generada", HttpStatus.NOT_FOUND);
            }
            
            order.order_id_woocommerce = id;
            order.save();

            return {
                status: HttpStatus.OK,
                message: "Orden creada correctamente",
                order
            }
        } catch (error) {
            throw new HttpException("La orden no ha sido creada", HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(): Promise<any>{
        const orders = await this.model.find();
        if(orders.length === 0){
            return {
                status: HttpStatus.NOT_FOUND,
                message: "ordenes no encontradas"
            }
        }

        return {
            status: HttpStatus.OK,
            message: "listado de ordenes",
            orders
        }
    }

    async findOne(id:string):Promise<any> {
        try {
            const order = await this.model.findById(id);
            return {
                status: HttpStatus.OK,
                message: "detalle de la orden",
                order
            }
        } catch (error) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Orden no encontrada"
            }
        }
    }

    async delete(id:string):Promise<any>{
        await this.model.findByIdAndDelete(id);

        return {
            status: HttpStatus.NO_CONTENT,
            message: "La orden ha sido eliminada"
        }
    } 

    async preference(data:any):Promise<any> {
        
        let {order:{billing, shipping, line_items, shipments}, items} = data;
        shipments.receiver_address = {
            street_name: billing.address_1,
            country_name:"Colombia",
            state_name: billing.state,
            city_name: billing.city
        }

        const body = {
            auto_return: "approved",
            back_urls : {
                success: "https://titandecko.com.co/comprar-ahora",
                pending: "https://titandecko.com.co/comprar-ahora",
                failure: "https://titandecko.com.co/comprar-ahora",
            },
            items,
            payer: {
                name: billing.first_name,
                surname: billing.last_name,
                email: billing.email,
                phone: {
                  area_code: "",
                  number: billing.phone
                },
                identification: {
                  "type": "Tipo de documento",
                  "number": "Número de documento"
                },
                address: {
                    street_name: billing.address_1,
                    street_number: null,
                    zip_code: "Código postal"
                }
            },
            redirect_urls : {
                success: "https://titandecko.com.co/comprar-ahora",
                pending: "https://titandecko.com.co/comprar-ahora",
                failure: "https://titandecko.com.co/comprar-ahora"
            },
            shipments
        }

        const client = new MercadoPagoConfig({accessToken: process.env.TOKEN_ACCESS_MP_P, options: {timeout: 5000}});
        const preference = new Preference(client); 
        let result = await preference.create({body: body})
        return {
            status: HttpStatus.ACCEPTED,
            message: "preference generated",
            result
        }
    }

    async create_payment(req:any, data:any): Promise<any> {
        try{
            const ipClient = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
            let {params, order} = data
            let {formData} = params
            
            const body = {
                transaction_amount: formData.transaction_amount ,
                description: `${order.line_items.length} articulos variados`,
                payment_method_id: formData.payment_method_id,
                payer: {
                    email: formData.payer.email,
                    entity_type: formData.payer.entity_type,
                    identification: formData.payer.identification
                },
                additional_info: {
                    ip_address: ipClient  // Asegúrate de reemplazar ipCliente con la variable que contiene la IP real
                },
                token: formData.token,
                installments: formData.installments,
                transaction_details: formData.transaction_details,
                callback_url: "https://titandecko.com.co/comprar-ahora"
            }
            
            const client = new MercadoPagoConfig({ accessToken: process.env.TOKEN_ACCESS_MP_P });
            const payment = new Payment(client);
            let result = await payment.create({ body: body});
            
            return {
                statusCode: HttpStatus.ACCEPTED,
                result
            }
        }catch(error){
            throw new HttpException("El metodo de pago ha fallado", HttpStatus.BAD_REQUEST);
        }
    }

    async sendOrder(order: OrderDTO): Promise<any>{
        try{
            if(order.status === "processing"){
                delete order.set_paid;
            }
                        
            let response = await fetch("https://tinco.com.co/wp-json/wc/v3/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic Y2tfZTM5YjIwNmEyN2E1NTE3NDE4Yjc1YjhjOTUyM2I2OWViYTMyNzBjNTpjc180MDg3MmY0OWNiYjU5NjIxOGE4ODE3ODhmYWM3M2M0ZTEyODNmNjhk`,
                },
                body: JSON.stringify(order)
            });
            
            let result = await response.json();
            return result;
        }catch(error){
            throw new HttpException("La orden no ha sido guardada", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    validateStatus(status:string):any {
        let dataStatus = {
            approved: "completed",
            pending: "pending",
            in_process: "on-hold",
            authorized: "on-hold",
            cancelled: "cancelled",
            refunded: "refunded",
            charged_back: "refunded",
            rejected: "failed"
        }

        let paid = false;

        if (dataStatus.approved === status){
            paid = true;
        }

        return {status: dataStatus[status], paid};
    }


    async getAllProducts(){
        try{
            let allProducts = [];
            let page = 1;
            let perPage = 100;
        
            while (true) {
                
                try {
                    const response = await fetch(`https://tinco.com.co/wp-json/wc/v3/products?stock_status=instock&status=publish&per_page=${perPage}&page=${page}`, {method: "GET", headers: {"Authorization": `Basic Y2tfZDY0MWI4Y2VkODMyZjE3NTFjODk4NzMwMmI5ZjkwMzc5NGFjYjA5ZTpjc18xMDdiZDZkZDMxMjdlYjBlM2MyM2U2ZTE3MTU1YWJlODNjNjgwMjcy`}});
                    const products = await response.json();
                    if (products.length === 0) {
                        break; // No hay más productos
                    }
            
                    allProducts = allProducts.concat(products);
                    page++;
                } catch (error) {
                    error;
                    // break;
                }
            }
        
            return allProducts;
        }catch(error){
            error
        }
    }

    async getProductXml(products) {
        const xml = xmlbuilder.create('rss', { version: '1.0', encoding: 'UTF-8' })
            .att('version', '2.0')
            .att('xmlns:g', 'http://base.google.com/ns/1.0')
            .ele('channel')
            .ele('title', 'Tu Feed de Productos').up()
            .ele('link', 'https://titandecko.com.co').up()
            .ele('description', 'Descripción del feed de tus productos.').up();
    
        products.forEach(product => {
            let cadena = product.stock_status;
            xml.ele('item')
                .ele('g:id', product.id).up()
                .ele('g:region_id', 'CO').up()
                .ele('g:title').cdata(product.name).up()
                .ele('g:description').cdata(product.description).up()
                .ele('g:link', `https://titandecko.com.co/producto/${product.slug}/${product.id}`).up()
                .ele('g:image_link', `https://titandecko.com.co/_next/image?url=${product?.images[0]?.src}&w=1920&q=75`).up()
                .ele('g:price', `${product.price} COP`).up()
                .ele('g:availability', cadena.replace("instock", "in stock")).up()
                .ele('g:brand', 'titandecko').up()
                .ele('g:update_type', 'merge').up()
                .ele('g:condition', 'new').up();
            // Añade más elementos XML según los atributos de tus productos
        });
    
        return xml.end({ pretty: true });
    }



    async cart_abandoment(cart:any){
        // Uso de la función
     
        this.updateOrCreateExcel('cart_abandonment', cart)
           .then(() => console.log('Excel file updated or created successfully.'))
           .catch((error) => console.error('Error updating or creating Excel file:', error));

       return {
           status: HttpStatus.ACCEPTED,
           message: "save cart",
       }      
   }


    async updateOrCreateExcel(fileName: string, item: CartItem): Promise<void> {
       const filePath = `${fileName}.xlsx`;
       const sheetName = 'Cart Abandonment';
     
       // Verificar si el archivo existe
       if (fs.existsSync(filePath)) {
         // Leer el archivo existente
         const workbook = XLSX.readFile(filePath);
         const worksheet = workbook.Sheets[sheetName] || XLSX.utils.json_to_sheet([]);
     
         // Convertir la hoja de trabajo a JSON, agregar el nuevo item y convertir de nuevo a hoja de trabajo
         const jsonData = XLSX.utils.sheet_to_json(worksheet);
         jsonData.push(item);
         const newWorksheet = XLSX.utils.json_to_sheet(jsonData);
     
         // Reemplazar o agregar la hoja de trabajo en el libro de trabajo
         workbook.Sheets[sheetName] = newWorksheet;
     
         // Escribir el libro de trabajo modificado
         XLSX.writeFile(workbook, filePath);
       } else {
         // Crear un nuevo libro de trabajo y hoja de trabajo con el item
         const workbook = XLSX.utils.book_new();
         const worksheet = XLSX.utils.json_to_sheet([item]);
     
         // Agregar la hoja de trabajo al libro de trabajo
         XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
     
         // Escribir el nuevo libro de trabajo
         XLSX.writeFile(workbook, filePath);
       }
   }


}

import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ORDERS } from 'src/common/models/models';
import { ordersSchema } from './schemas/orders.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: ORDERS.name,
      useFactory: () => {return ordersSchema}
    }])
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}

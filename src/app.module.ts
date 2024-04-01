import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './locations/locations.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.development"],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.URL_MONGODB),
    UsersModule,
    OrdersModule,
    AuthModule,
    LocationsModule,
    QuestionsModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}

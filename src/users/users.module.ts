import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { USERS } from 'src/common/models/models';
import { userSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: USERS.name,
      useFactory: () => {return userSchema}
    }])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}

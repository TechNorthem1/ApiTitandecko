import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AUTH, USERS } from 'src/common/models/models';
import { authSchema } from './schema/auth.schema';
import { UsersModule } from 'src/users/users.module';
import { userSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_KEY,
        expiresIn: process.env.EXPIRES_IN,
      })
    }),
    MongooseModule.forFeatureAsync([{
      name: AUTH.name,
      useFactory: () => {return authSchema}
    }]),
    MongooseModule.forFeatureAsync([{
      name: USERS.name,
      useFactory: () => {return userSchema}
    }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}

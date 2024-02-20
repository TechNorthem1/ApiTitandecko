import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DEPARTAMENTS, MUNICIPALITIES } from 'src/common/models/models';
import { departamentSchema } from './schema/departament.schema';
import { municipalitySchema } from './schema/municipality.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: DEPARTAMENTS.name,
      useFactory: () => {return departamentSchema}
    }]),
    MongooseModule.forFeatureAsync([{
      name: MUNICIPALITIES.name,
      useFactory: () => {return municipalitySchema}
    }]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService]
})
export class LocationsModule {}

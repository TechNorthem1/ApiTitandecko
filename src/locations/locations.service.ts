import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDepartament } from 'src/common/interfaces/departament.interface';
import { IMunicipaly } from 'src/common/interfaces/municipalities.interface';
import { DEPARTAMENTS, MUNICIPALITIES } from 'src/common/models/models';

@Injectable()
export class LocationsService {
    constructor(
        @InjectModel(DEPARTAMENTS.name) private readonly modelDep:Model<IDepartament>,
        @InjectModel(MUNICIPALITIES.name) private readonly modelMun:Model<IMunicipaly>
    ){}

    async departaments():Promise<IDepartament[]>{
        return this.modelDep.find();
    }

    async municipalities(id:string):Promise<IMunicipaly[]> {
        return this.modelMun.find({departament: id});
    }
}

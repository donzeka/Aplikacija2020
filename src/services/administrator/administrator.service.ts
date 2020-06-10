import { Injectable } from '@nestjs/common';
import { Administrator } from 'entities/administrator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdministratorService {
    constructor(
        @InjectRepository(Administrator)
        private readonly administrator: Repository<Administrator>
    ){ }

    getAll(): Promise<Administrator[]>{
        return this.administrator.find();
    }

    getById(id:number): Promise<Administrator>{
        return this.administrator.findOne(id);
    }
}

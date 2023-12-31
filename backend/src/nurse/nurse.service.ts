import { Injectable } from '@nestjs/common';
import { NurseEntity } from './nurse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NurseService {
  constructor(
    @InjectRepository(NurseEntity)
    private nurseRepository: Repository<NurseEntity>,
  ) {}

  async getNurses(): Promise<NurseEntity[]> {
    return this.nurseRepository.find();
  }

  async getNurse(id : number): Promise<NurseEntity> {
    return this.nurseRepository.findOneByOrFail({id});
  }

  async createNurse(name : string): Promise<NurseEntity> {
    return this.nurseRepository.save({ name });
  }

  async setPreferences(id: number, preferences: any): Promise<NurseEntity> {
    const nurse = await this.nurseRepository.findOneByOrFail({id});
    if (!nurse) {
      throw new Error(`Nurse with ID ${id} not found`);
    }
    nurse.preferences = preferences;
    return this.nurseRepository.save(nurse);
  }
}

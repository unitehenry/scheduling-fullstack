import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftEntity, ShiftRequirements, ShiftType } from './shift.entity';
import { NurseEntity } from '../nurse/nurse.entity';
import { ScheduleEntity } from '../schedule/schedule.entity';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(ShiftEntity)
    private readonly shiftRepository: Repository<ShiftEntity>,
  ) {}

  async createShift(type : ShiftType, nurse : NurseEntity, schedule: ScheduleEntity) {
    return this.shiftRepository.save({
      type,
      nurse,
      schedule,
      date: new Date()
    });
  }

  async getAllShifts() {
    return this.shiftRepository.find();
  }

  async getShiftsByNurse(nurseId: string) {
    throw new NotImplementedException();
  }

  async getShiftsBySchedule(scheduleId: string) {
    throw new NotImplementedException();
  }

  async getShiftRequirements(): Promise<ShiftRequirements[]> {
    const filePath = path.join(process.cwd(), './src/shift/shiftRequirements.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const shiftRequirements: ShiftRequirements[] = (JSON.parse(fileContents)["shiftRequirements"]);
    return shiftRequirements;
  }
}

import * as fs from 'fs';
import * as path from 'path';
import { Inject, Injectable, NotImplementedException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftEntity, ShiftRequirements, ShiftDayOfWeek, ShiftType } from './shift.entity';
import { NurseEntity } from '../nurse/nurse.entity';
import { ScheduleEntity } from '../schedule/schedule.entity';
import { NurseService } from '../nurse/nurse.service';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(ShiftEntity)
    private readonly shiftRepository: Repository<ShiftEntity>,
    @Inject(forwardRef(() => NurseService))
    private readonly nurseService: NurseService,
  ) {}

  async createShift(dayOfWeek : ShiftDayOfWeek, type : ShiftType, nurse : NurseEntity, schedule: ScheduleEntity) {
    return this.shiftRepository.save({
      dayOfWeek,
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
    return this.shiftRepository.createQueryBuilder('shifts')
      .leftJoinAndSelect('shifts.nurse', 'nurses')  
      .where('nurseId = :nurseId', { nurseId })
      .getMany()
  }

  async getShiftsBySchedule(scheduleId: string) {
  return this.shiftRepository.createQueryBuilder('shifts')
      .leftJoinAndSelect('shifts.nurse', 'nurses')
      .where('scheduleId = :scheduleId', { scheduleId })
      .getMany()
  }

  async getShiftRequirements(): Promise<ShiftRequirements[]> {
    const filePath = path.join(process.cwd(), './src/shift/shiftRequirements.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const shiftRequirements: ShiftRequirements[] = (JSON.parse(fileContents)["shiftRequirements"]);
    return shiftRequirements;
  }
}

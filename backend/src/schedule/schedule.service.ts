import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import { ShiftService } from '../shift/shift.service';
import { NurseService } from '../nurse/nurse.service';
import { ShiftEntity, ShiftDayOfWeek, ShiftType } from '../shift/shift.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    private readonly shiftService: ShiftService,
    private readonly nurseService: NurseService,
  ) {}

  async generateSchedule(): Promise<any> {
    // Create schedule
    const schedule = await this.scheduleRepository.save({ shifts: [] });
    // Get all shift requirements
    const shiftRequirements = await this.shiftService.getShiftRequirements();
    // Get all nurses
    const nurses = await this.nurseService.getNurses();
    // Current nurse pointer = 0
    let currentNurseIdx = 0;
    const shifts : Promise<ShiftEntity>[] = [];
    // Iterate through each day * shift type
    [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ].forEach(dayOfWeek => {
      [ 'day', 'night' ].forEach(shiftType => {
        const requirement = shiftRequirements.find(req => req.shift === shiftType && req.dayOfWeek === dayOfWeek);
        let shiftsCreated = 0;
        let endingNurseIdx = currentNurseIdx - 1;
        if (currentNurseIdx === 0) {
          endingNurseIdx = (nurses.length - 1);
        }
        if (currentNurseIdx < 0) {
          endingNurseIdx = 0;
        }
        while(shiftsCreated < (requirement?.nursesRequired ?? 0) && currentNurseIdx !== endingNurseIdx) {
          // If nurse can work that day, add shift
          const nurse = nurses[currentNurseIdx];
          const preferences = nurse.preferences as any;
          if (preferences && preferences[dayOfWeek]) {
            const pref = preferences[dayOfWeek];
            if (pref !== 'unavailable' && (pref === 'any' || pref === shiftType)) {
              const shift = this.shiftService.createShift(dayOfWeek as ShiftDayOfWeek, shiftType as ShiftType, nurse, schedule);
              shifts.push(shift);
              shiftsCreated++;
            }
          } else {
            // create shift
            const shift = this.shiftService.createShift(dayOfWeek as ShiftDayOfWeek, shiftType as ShiftType, nurse, schedule);
            shifts.push(shift);
            shiftsCreated++;
          }
          const nextNurseIdx = currentNurseIdx + 1;
          if (nurses[nextNurseIdx] === undefined) {
            currentNurseIdx = 0;
          } else {
            currentNurseIdx = nextNurseIdx;
          }
        }
      });
    });
    await Promise.all(shifts);
    return this.scheduleRepository.findOneByOrFail({ id: schedule.id });
  }

  async getSchedules(): Promise<any> {
    return this.scheduleRepository.find();
  }

  async getScheduleById(id: number): Promise<any> {
    return this.scheduleRepository.findOneByOrFail({id});
  }

  async getScheduleRequirements(): Promise<any> {
    // TODO: Complete the implementation of this method
    // Schedule requirements can be hard-coded
    // Requirements must indicate the number of nurses required for each shift type on each day of a week
    // Create the requirements as JSON and make it available via this method
    throw new NotImplementedException();
  }
}

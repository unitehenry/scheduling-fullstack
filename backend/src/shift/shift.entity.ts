import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { NurseEntity } from '../nurse/nurse.entity';
import { ScheduleEntity } from '../schedule/schedule.entity';

export type ShiftType = 'day' | 'night';
export type ShiftDayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type ShiftRequirements = {
  shift: ShiftType;
  nursesRequired: number;
  dayOfWeek: string;
};

@Entity('shifts')
export class ShiftEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  type: ShiftType;

  @ManyToOne(() => NurseEntity, nurse => nurse.shifts)
  nurse: NurseEntity;

  @ManyToOne(() => ScheduleEntity, (schedule) => schedule.shifts)
  schedule: ScheduleEntity;

  @Column()
  date: Date;

  @Column({ type: 'varchar', length: 25 })
  dayOfWeek: ShiftDayOfWeek;

}

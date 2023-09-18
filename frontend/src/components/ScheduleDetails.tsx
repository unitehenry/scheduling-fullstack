import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/apiService';

export default function ScheduleDetails() {

  const params = useParams();

  const [requirements, setRequirements] = useState<unknown[] | null>(null);
  const [schedule, setSchedule] = useState<unknown | null>(null);

  useEffect(() => {
    if (schedule) return;

    const fetchSchedule = async () => {
      const schedule = await api.default.getSchedule(params.scheduleId);
      console.log(schedule);
      setSchedule(schedule);
    }

    fetchSchedule().catch(console.error);
  });

  useEffect(() => {
    if (requirements) return;

    const fetchRequirements = async () => {
      const requirements = await api.default.getShiftRequirements();
      setRequirements(requirements);
    }

    fetchRequirements().catch(console.error);
  }, []);

  const getShiftCount = (dayOfWeek : string, shiftType : string) => {
    return schedule.shifts.reduce((count, shift) => {
      if (shift.type === shiftType && shift.dayOfWeek === dayOfWeek)
        return count + 1;
      return count;
    }, 0);
  }

  if (!schedule) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Schedule {schedule.id}</h2>
      <table>
        <thead>
          <tr>
            <th>Day of the week</th>
            <th>Shift type</th>
            <th>Shifts scheduled</th>
            <th>Shifts required</th>
          </tr>
        </thead>
        <tbody>
          {
            requirements.map(req => {
              const shiftCount = getShiftCount(req.dayOfWeek, req.shift);
              return (
                <tr
                  key={`${req.shift}${req.dayOfWeek}`}
                  className={shiftCount < parseInt(req.nursesRequired, 10) ? 'shift-warning' : ''}>
                  <td>{req.dayOfWeek}</td>
                  <td>{req.shift}</td>
                  <td>{shiftCount}</td>
                  <td>{req.nursesRequired}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
};

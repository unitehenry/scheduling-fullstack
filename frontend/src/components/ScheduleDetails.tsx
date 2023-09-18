import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as api from '../services/apiService';

export default function ScheduleDetails() {

  const params = useParams();

  const [requirements, setRequirements] = useState<unknown[] | null>(null);
  const [schedule, setSchedule] = useState<unknown | null>(null);
  const [shifts, setShifts] = useState<unkown[] | null>(null);

  useEffect(() => {
    if (schedule) return;

    const fetchSchedule = async () => {
      const schedule = await api.default.getSchedule(params.scheduleId);
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

  useEffect(() => {
    if (shifts) return;

    const fetchShifts = async () => {
      const shifts = await api.default.getShiftsBySchedule(params.scheduleId);
      console.log(shifts);
      setShifts(shifts);
    }

    fetchShifts().catch(console.error);
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
    <div className="schedule-details-page">
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
      <table>
        <thead>
          <tr>
            <th>Day of the week</th>
            <th>Shift type</th>
            <th>Nurse</th>
          </tr>
        </thead>
        <tbody>
          {
            shifts.map(shift => (
              <tr key={shift.id}>
                <td>{shift.dayOfWeek}</td>
                <td>{shift.type}</td>
                <td>
                  <Link to={`/nurses/${shift.nurse.id}`}>
                    {shift.nurse.name}
                  </Link>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

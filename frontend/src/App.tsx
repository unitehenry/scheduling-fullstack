
import { useEffect, useState } from 'react';
import * as api from './services/apiService';
import m7Logo from '/Logo-black.png'
import { Link, useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();

  const [nurses, setNurses] = useState<unknown[] | null>(null);
  const [requirements, setRequirements] = useState<unknown[] | null>(null);
  const [schedules, setSchedules] = useState<unknown[] | null>(null);

  const [ isGenerating, setIsGenerating ] = useState<boolean>(false);

  useEffect(() => {
    const fetchNurses = async () => {
      const nurses = await api.default.getNurses();
      setNurses(nurses);
    }

    fetchNurses().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchRequirements = async () => {
      const requirements = await api.default.getShiftRequirements();
      setRequirements(requirements);
    }

    fetchRequirements().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      const schedules = await api.default.getSchedules();
      setSchedules(schedules);
    }

    fetchSchedules().catch(console.error);
  }, []);

  const generateSchedule = async (evt) => {
    try {
      setIsGenerating(true);
      evt.preventDefault();
      const schedule = await api.default.generateSchedule();
      navigate(`/schedules/${schedule.id}`);
    } catch(err) {
      alert('Failed to generate schedule');
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
    }
  }

  return (
    <>
      <div>
        <a href="https://m7health.com" target="_blank">
          <img src={m7Logo} className="logo" alt="M7 Health logo" />
        </a>
      </div>
      <h1>M7 Health scheduling exercise</h1>
      <div className="card">
        Check the README for guidance on how to complete this exercise.
        Find inspiration <a href="https://www.m7health.com/product" target="_blank">on M7's site</a>.
      </div>
      <div className='card'>
        <h2>Nurses</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {nurses && (nurses.map((nurse: any) => (
              <tr key={nurse.id}>
                <td>{nurse.id}</td>
                <td>
                  <Link to={`/nurses/${nurse.id}`}>
                    {nurse.name}
                  </Link>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
        <div className='card-actions'>
          <Link to="/nurses/new">
            Add nurse
          </Link>
        </div>
      </div>
      <div className='card'>
        <h2>Shift Requirements</h2>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Shift</th>
              <th>Nurses required</th>
            </tr>
          </thead>
          <tbody>
            {requirements && (requirements.map((req: any) => (
              <tr key={req.dayOfWeek + "-" + req.shift}>
                <td>{req.dayOfWeek}</td>
                <td>{req.shift}</td>
                <td>{req.nursesRequired}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      <div className='card'>
        <h2>Schedules</h2>
        {schedules && (schedules.map((schedule: any) => (
          <div className='schedule' key={schedule.id}>
            <Link to={`/schedules/${schedule.id}`}>
              Schedule #{ schedule.id }
            </Link>
          </div>
        )))}
        <div className='card-actions'>
          {
            isGenerating ? (
              <span>
                Generating schedule, please wait...
              </span>
            ) : (
              <a href="#" onClick={generateSchedule}>
                Generate schedule
              </a>
            )
          }
        </div>
      </div>
    </>
  )
}

export default App

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/apiService';

const fields = [
  {
    key: 'name',
    label: 'Name',
    type: 'text'
  }
]

interface NurseDetailsProps {
  nurse : unkown|null;
  setNurse : (key : string, value : string) => void;
}

function NurseDetails({ nurse, setNurse } : NurseDetailsProps) {
  return (
    <form>
      {
        fields.map(field => (
          <div className="form-input" key={field.key}>
            <label>
              {field.label}
            </label>
            <input
              type={field.type}
              value={nurse[field.key]}
              onChange={evt => setNurse(field.key, evt.target.value)} />
          </div>
        ))
      }
    </form>
  )
}

interface NurseScheduleProps {
  preferences : unkown|any;
  setPreferences : (key : string, value : string) => void;
}

function NurseSchedule({ preferences, setPreferences } : NurseScheduleProps) {

  const availabilityOptions = [
    {
      key: 'any',
      label: 'Any shift'
    },
    {
      key: 'day',
      label: 'Day shift'
    },
    {
      key: 'night',
      label: 'Night shift'
    },
    {
      key: 'unavailable',
      label: 'Unavailable'
    },
  ]

  return (
    <table>
      <thead>
        <tr>
          <th>
            Day of the week
          </th>
          <th>
            Availibility preference
          </th>
        </tr>
      </thead>
      <tbody>
        {
          [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]
            .map(dow => (
              <tr key={dow}>
                <td>{dow}</td>
                <td>
                  <select
                    className="nurse-schedule-select"
                    onChange={evt => setPreferences(dow, evt.target.value)}
                    value={preferences[dow]}>
                    {
                      availabilityOptions.map(opt => (
                        <option key={opt.key} value={opt.key}>
                          { opt.label }
                        </option>
                      ))
                    }
                  </select>
                </td>
              </tr>
            ))
        }
      </tbody>
    </table>
  )
}

export default function Nurse() {

  const navigate = useNavigate();
  const params = useParams();

  const [ nurse, setNurse ] = useState<unkown|null>();
  const [ preferences, setPreferences ] = useState<unkown|null>();

  useEffect(() => {
    if (params.nurseId === 'new') {
      setNurse({
        name: '',
        preference: {},
      });
    } else {
      const fetchNurse = async () => {
        const nurseId = parseInt(params.nurseId ?? '0', 10);
        const nurse = await api.default.getNurse(nurseId);
        setNurse(nurse);
        setPreferences(nurse.preferences || {})
      }

      fetchNurse().catch(console.error);
    }
  }, []);

  const onSave = async (evt) => {
    try {
      evt.preventDefault();
      await api.default.setNursePreferences(nurse.id, JSON.stringify(preferences));
      alert('Nurse saved');
    } catch(err) {
      console.error(err);
    }
  }

  if (!nurse) return <></>

  return (
    <div className="nurse-page">
      <NurseDetails
        nurse={nurse}
        setNurse={(key, value) => setNurse({ ...nurse, [key]: value })} />
      <NurseSchedule
        preferences={preferences}
        setPreferences={(key, value) => setPreferences({ ...preferences, [key]: value })} />
      <div className="nurse-actions">
        <a href="#" onClick={() => navigate(-1)}>
          Back
        </a>
        <a href="#" onClick={onSave}>
          Save Nurse
        </a>
      </div>
    </div>
  )
}

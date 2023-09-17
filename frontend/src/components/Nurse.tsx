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

function NurseSchedule() {

  const availabilityOptions = [
    {
      key: 'unavailable',
      label: 'Unavailable'
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
      key: 'any',
      label: 'Any shift'
    }
  ]

  return (
    <table>
      <tr>
        <th>
          Day of the week
        </th>
        <th>
          Availibility preference
        </th>
      </tr>
      {
        [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]
          .map(dow => (
            <tr key={dow}>
              <td>{dow}</td>
              <td>
                <select className="nurse-schedule-select">
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
    </table>
  )
}

export default function Nurse() {

  const navigate = useNavigate();
  const params = useParams();

  const [ nurse, setNurse ] = useState<unkown|null>();

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
      }

      fetchNurse().catch(console.error);
    }
  }, []);

  if (!nurse) return <></>

  return (
    <div className="nurse-page">
      <NurseDetails
        nurse={nurse}
        setNurse={(key, value) => setNurse({ ...nurse, [key]: value })} />
      <NurseSchedule />
      <div className="nurse-actions">
        <a href="#" onClick={() => navigate(-1)}>
          Back
        </a>
        <a href="#">
          Save Nurse
        </a>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom';
import * as api from '../services/apiService';

function ShiftDetails() {

  const fields = [
    {
      key: 'day',
      label: 'Day',
      type: 'select',
      options: [
        {
          key: 'monday',
          label: 'Monday'
        },
        {
          key: 'tuesday',
          label: 'Tuesday'
        },
        {
          key: 'wednesday',
          label: 'Wednesday'
        },
        {
          key: 'thursday',
          label: 'Thursday'
        },
        {
          key: 'friday',
          label: 'Friday'
        },
        {
          key: 'saturday',
          label: 'Saturday'
        },
        {
          key: 'sunday',
          label: 'Sunday'
        }
      ]
    },
    {
      key: 'shift',
      label: 'Shift',
      type: 'select',
      options: [
        {
          key: 'day',
          label: 'Day',
        },
        {
          key: 'night',
          label: 'Night'
        }
      ]
    },
    {
      key: 'nurses',
      label: 'Nurses required',
      type: 'number'
    }
  ];

  return (
    <form>
    {
      fields.map(field => (
        <div key={field.key} className="form-input">
          <label>
            {field.label}
          </label>
          {
            field.type === 'select' ? (
              <select>
                {
                  field.options.map(opt => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))
                }
              </select>
            ) : <></>
          }
          {
            field.type === 'number' ? (
              <input type={field.type} />
            ) : <></>
          }
        </div>
      ))
    }
    </form>
  )
}

export default function Shift() {
  return (
    <div className="shift-page">
      <ShiftDetails />
      <div className="shift-actions">
        <Link to="/">
          Return to Dashboard
        </Link>
        <a href="#">
          Save Shift
        </a>
      </div>
    </div>
  );
}

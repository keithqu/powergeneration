import { useContext } from 'react';
import { StoreContext } from '../../context/Store';

import ReactCountryFlag from 'react-country-flag';
import getCountryISO2 from 'country-iso-3-to-2';

const Aggregates = () => {
  const [state,] = useContext(StoreContext);
  const { aggregateData: { production } } = state;

  return (
    <div className='aggregate-list'>
      <div className="note">*These are based only on the power plants in the dataset*</div>
      <ol>
        {
          production.length > 0 && production.map(d => (
            <li key={`${d.country}-aggregate-list-item`} className='aggregate-list-item'>
              <ReactCountryFlag svg countryCode={getCountryISO2(d.country) || 'XK'} />{' '}
              { d.country_long }
              <span className='total'>{ Math.round(d.total) }</span>
            </li>
          ))
        }
      </ol>
    </div>
  )
}

export default Aggregates;

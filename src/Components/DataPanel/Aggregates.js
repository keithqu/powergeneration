import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/Store';

import { Tab, Tabs } from "@blueprintjs/core";

import ReactCountryFlag from 'react-country-flag';
import getCountryISO2 from 'country-iso-3-to-2';
import axios from 'axios';

const Aggregates = () => {
  const [state, dispatch] = useContext(StoreContext);
  const [index, setIndex] = useState('all')
  const { aggregateData: { production }, fuelAggregates } = state;

  useEffect(() => {
    index === 'fuel' && !fuelAggregates &&
      axios('/api/aggregate/fuel', { method: 'get' })
       .then(({ data }) => dispatch({ type: 'SET_FUEL_AGGREGATES', payload: data }))
  }, [index, fuelAggregates, dispatch])

  const handleIndex = id => setIndex(id)

  const selectCountry = (e, country) => {
    e.preventDefault();
    dispatch({
      type: "SET_MAP_SELECTION",
      payload: country
    });
  }

  return (
    <Tabs className='aggregate-tabs' id="aggregatetabs" onChange={handleIndex} selectedTabId={index} animate={true} large={true} >
      <Tab title="Total" id="all" panel={
        <div className='aggregate-list'>
          <div className="note">*These are based only on the power plants in the dataset*</div>
          <ol>
            {
              production.length > 0 && production.map(d => (
                <li key={`${d.country}-aggregate-list-item`} className='aggregate-list-item'>
                  <ReactCountryFlag svg countryCode={getCountryISO2(d.country) || 'XK'} />{' '}
                  <a href="." onClick={e => selectCountry(e, d.country)}>{ d.country_long }</a>
                  <span className='total'>{ Math.round(d.total).toLocaleString('en') }</span>
                </li>
              ))
            }
          </ol>
        </div>
      } />
      <Tab title="Fuel" id="fuel" panel={
        <div className='aggregate-list'>
          <div className="note">*These are based only on the power plants in the dataset*</div>
          <ol>
            {
              fuelAggregates && fuelAggregates.length > 0 && fuelAggregates.map(d => (
                <li key={`${d.primary_fuel}-list-item`} className='aggregate-list-item'>
                  { d.primary_fuel }
                  <span className='total'>{ Math.round(d.total).toLocaleString('en') }</span>
                </li>
              ))
            }
          </ol>
        </div>
      } />
    </Tabs>
  )
}

export default Aggregates;

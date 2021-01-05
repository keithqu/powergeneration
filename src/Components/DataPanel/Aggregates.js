import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/Store';

import { Callout, Tab, Tabs } from "@blueprintjs/core";

import ReactCountryFlag from 'react-country-flag';
import getCountryISO2 from 'country-iso-3-to-2';

import { ResponsiveBar } from '@nivo/bar';

import axios from 'axios';

const Aggregates = () => {
  const [state, dispatch] = useContext(StoreContext);
  const [index, setIndex] = useState('all')
  const { aggregateData: { production }, fuelAggregates } = state;

  useEffect(() => {
    index === 'fuel' && !fuelAggregates &&
      axios('/api/aggregate/fuel', { method: 'get' })
       .then(({ data }) => {
         dispatch({ type: 'SET_FUEL_AGGREGATES', payload: data });
       })
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
      <Tab title="By Country" id="all" panel={
        <Callout title="Total Production Rankings">
          <div className='aggregate-list'>
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
        </Callout>
      } />
      <Tab title="By Fuel Type" id="fuel" panel={
        <>
          <Callout title="Production by Fuel Type (GWh)">
            <div style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}>
              {
                fuelAggregates && fuelAggregates.bar && fuelAggregates.pct &&
                  <ResponsiveBar
                    data={fuelAggregates.bar}
                    keys={fuelAggregates.barKeys}
                    theme={{
                      fontFamily: 'Raleway',
                      fontSize: '16px'
                    }}
                    indexBy="country"
                    margin={{ top: 10, right: 0, bottom: 10, left: 100 }}
                    padding={0.15}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={({ id, data }) => data[`${id}Color`] }
                    borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={{
                        tickSize: 1,
                        tickPadding: 1,
                        tickRotation: 0,
                        legend: 'Production (GWh)',
                        legendPosition: 'middle',
                        legendOffset: -90
                    }}
                    label={d => `${d.id}: ${Math.round(d.value).toLocaleString('en')} (${fuelAggregates.pct.filter(e => e.id === d.id)[0]?.value}%)`}
                    tooltip={d => `${d.id}: ${Math.round(d.value).toLocaleString('en')} (${fuelAggregates.pct.filter(e => e.id === d.id)[0]?.value}%)`}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={'#000000'}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                  />
              }
            </div>
          </Callout>
        </>
      } />
    </Tabs>
  )
}

export default Aggregates;

          //   <div className='aggregate-list'>
          //     <ol>
          //       {
          //         fuelAggregates && fuelAggregates.reg.length > 0 && fuelAggregates.reg.map(d => (
          //           <li key={`${d.primary_fuel}-list-item`} className='aggregate-list-item'>
          //             { d.primary_fuel }
          //             <span className='total'>{ Math.round(d.total).toLocaleString('en') }</span>
          //           </li>
          //         ))
          //       }
          //     </ol>
          //   </div>
          // </Callout>
          // <Callout title="Fuel Type Percentages">
          //   <div style={{height:'400px'}}>
          //     { 
          //       fuelAggregates && fuelAggregates.pct &&
          //         <ResponsivePie
          //           data={fuelAggregates.pct}
          //           margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
          //           innerRadius={0.2}
          //           padAngle={1}
          //           cornerRadius={5}
          //           colors={{ datum: 'data.color' }}
          //           borderWidth={2}
          //           borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
          //           enableRadialLabels={false}
          //           sliceLabel={d => `${d.id} ${d.value}%`}
          //           sliceLabelsSkipAngle={5}
          //           sliceLabelsTextColor="#222222"
          //           // radialLabelsSkipAngle={5}
          //           // radialLabelsTextColor="#333333"
          //           // radialLabelsLinkColor={{ from: 'color' }}
          //           // radialLabelsLinkDiagonalLength={0}
          //           // radialLabelsLinkHorizontalLength={0}
          //         /> 
          //     }
          //   </div>
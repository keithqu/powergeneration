import { useContext } from 'react';
import { StoreContext } from '../../context/Store';

import { Callout } from '@blueprintjs/core';

import { ResponsiveBar } from '@nivo/bar';

const Country = () => {
  const [state, ] = useContext(StoreContext);
  const { mapSelection, countryData, aggregateData } = state;

  const topPlant = mapSelection in countryData && countryData[mapSelection].power.reduce((map,obj) => {
    const useEst = +obj.estimated_generation_gwh > +obj.generation_gwh_2017
    const production = useEst ? obj.estimated_generation_gwh : obj.generation_gwh_2017
    const currentGreater = production > map.production
    return {
      ...map,
      production: currentGreater ? production : map.production,
      est: currentGreater ? useEst : map.production,
      plant: currentGreater ? obj : map.plant
    }
  }, { production: null, est: null, plant: null });

  return (
    <div>
      <Callout title="Total Output" >
        <strong>{ Math.round(aggregateData.A3Mappings[mapSelection].total).toLocaleString('en') }</strong> GWh
        {' '}
        from <strong>{ countryData[mapSelection]?.power.length || '...' }</strong> plants on record
      </Callout>
      <Callout title="Top Producer" >
        {
          topPlant?.production > 0 ? (
            <div>
              <strong>{ topPlant?.plant?.name }</strong>, a <strong>{ topPlant?.plant?.primary_fuel }</strong> plant that produces <strong>{ Math.round(topPlant?.production).toLocaleString('en') }</strong> GWh
              ({ topPlant?.est ? '2018 estimate' : '2017 reported'})
            </div>
          ) : (
            <div>
              { !topPlant ? "..." : "Not enough production data." }
            </div>
          )
        }
      </Callout>
      <Callout title="Production by Fuel Type (GWh)">
        <div style={{ height: 'calc(100vh - 285px)', minHeight: '500px' }}>
          {
            mapSelection in countryData && countryData[mapSelection].bar && countryData[mapSelection].pct &&
              <ResponsiveBar
                data={countryData[mapSelection].bar}
                keys={countryData[mapSelection].barKeys}
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
                label={d => `${d.id}: ${Math.round(d.value).toLocaleString('en')} (${countryData[mapSelection].pct.filter(e => e.id === d.id)[0]?.value}%)`}
                tooltip={d => `${d.id}: ${Math.round(d.value).toLocaleString('en')} (${countryData[mapSelection].pct.filter(e => e.id === d.id)[0]?.value}%)`}
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
    </div>
  )
}

export default Country;

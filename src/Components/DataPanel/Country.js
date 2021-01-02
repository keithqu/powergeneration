import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/Store';

import { Callout } from '@blueprintjs/core';

const Country = () => {
  const [state, dispatch] = useContext(StoreContext);
  const { mapSelection, countryData, aggregateData } = state;

  const topPlant = mapSelection in countryData && countryData[mapSelection].reduce((map,obj) => {
    const useEst = obj.estimated_generation_gwh > obj.generation_gwh_2017
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
      <Callout
        title={aggregateData.A3Mappings[mapSelection].long}
      >
        <div>
          Total Output: <strong>{ Math.round(aggregateData.A3Mappings[mapSelection].total).toLocaleString('en') }</strong> GWh
        </div>
          {
            topPlant?.production > 0 ? (
              <div>
                Top producer: <strong>{ topPlant?.plant?.name }</strong>, a <strong>{ topPlant?.plant?.primary_fuel }</strong> plant that produces <strong>{ Math.round(topPlant?.production).toLocaleString('en') }</strong> GWh
                ({ topPlant?.est ? '2018 estimate' : '2017 reported'})
              </div>
            ) : (
              <div>
                { !topPlant ? "..." : "Not enough production data." }
              </div>
            )
          }
      </Callout>
      <div>
        Here is a pie graph with a breakdown of power generation by fuel type!!!
      </div>
      <div>
        Here are some other graphs!!!
      </div>
    </div>
  )
}

export default Country;

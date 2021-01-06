import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { Callout } from '@blueprintjs/core';

import axios from 'axios';
import { ResponsiveBar } from '@nivo/bar';

const order = ["Coal", "Gas", "Nuclear", "Hydro", "Solar", "Wind", "All Others"];
const colors = ["#e73538ee", "#227744ee"];

const commonProps = {
  margin: { top: 60, right: 80, bottom: 60, left: 80 },
  indexBy: 'country',
  padding: 0.2,
  labelTextColor: 'inherit:darker(1.4)',
  labelSkipWidth: 16,
  labelSkipHeight: 16,
}

const ComparisonPanel = memo(({ country1, country2 }) => {
  const [local, setLocal] = useState(null);
  const [display, ] = useState('production');

  const countryData = useMemo(() => {
    return (country1 && country2 && local && country1 in local && country2 in local) ? (
      order.map(d => ({ [country1]: !!local[country1][d] ? local[country1][d][display] : 0, [country2]: !!local[country2][d] ? -1 * local[country2][d][display] : 0, fuel_type: d }))
    ): []
  }, [country1, country2, display, local])

  const createCountryMap = (map,obj,order) => {
    const isMainFuel = order.includes(obj.primary_fuel)
    const fuelName = isMainFuel ? obj.primary_fuel : "All Others"
    map[fuelName] = {
      production: isMainFuel ? obj.total : !!map[fuelName]?.production ? map[fuelName].production + obj.total : obj.total || 0,
      capacity: isMainFuel ? obj.capacity_total : !!map[fuelName]?.capacity ? map[fuelName].capacity + obj.capacity_total : obj.capacity_total || 0
    };
    map.capacity = map.capacity ? map.capacity < obj.capacity_total ? obj.capacity_total : map.capacity : obj.capacity_total || 0;
    map.production = map.production ? map.production < obj.total ? obj.total : map.production : obj.total || 0;
    return map
  }

  const organizeData = useCallback((data) => {
    const c1Data = data.countryData[country1].reduce((map,obj) => createCountryMap(map, obj, order), {});
    const c2Data = data.countryData[country2].reduce((map,obj) => createCountryMap(map, obj, order), {});

    const final = {
      [country1]: c1Data,
      [country2]: c2Data
    }

    return final
  }, [country1, country2]);

  useEffect(() => {
    (async () => {
      const res = !!country1 && !!country2 &&
        await axios(`/api/comparison/${country1}/${country2}`, { method: 'get' })
      
      res && setLocal(organizeData(res.data))
    })();
  }, [country1, country2, organizeData])

  const divergingCommonProps = {
    ...commonProps,
    data: countryData,
    indexBy: 'fuel_type',
    minValue: local && country2 in local && -1 * local[country2][display],
    maxValue: local && country1 in local && local[country1][display],
    enableGridX: true,
    enableGridY: false,
    label: d => Math.abs(d.value),
    labelTextColor: 'inherit:darker(1.2)',
    axisTop: {
      tickSize: 0,
      tickPadding: 12,
    },
    axisBottom: {
      legend: 'Fuel Type',
      legendPosition: 'middle',
      legendOffset: 50,
      tickSize: 0,
      tickPadding: 12,
    },
    axisLeft: null,
    axisRight: {
        format: v => `${Math.abs(v)} GWh`,
    },
    markers: [
      {
        axis: 'y',
        value: 0,
        lineStyle: { strokeOpacity: 0 },
        textStyle: { fill: '#e73538ee' },
      },
      {
        axis: 'y',
        value: 0,
        lineStyle: { stroke: '#f47560', strokeWidth: 1 },
        textStyle: { fill: '#227744ee' },
      },
    ],
  }

  return (
    <>
      {
        !!country1 && !!country2 && (
          <Callout>
            <div style={{ height: '291px',  }}>
              <ResponsiveBar
                { ...divergingCommonProps }
                keys={[country1, country2]}
                padding={0.1}
                colors={colors}
                innerPadding={1}
              />
            </div>
            <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#e73538' }}>{country1}</div>
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#227744' }}>{country2}</div>
          </Callout>
        )
      }
    </>
  )
});

export default ComparisonPanel;

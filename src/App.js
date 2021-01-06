import { useContext, useEffect, useState } from 'react';
import { StoreContext } from './context/Store';

import { Intent } from '@blueprintjs/core';

import ComparisonPanel from './Components/ComparisonPanel/ComparisonPanel';
import DataPanel from './Components/DataPanel/DataPanel';
import GlobeMap from './Components/Map/GlobeMap';
import Topbar from './Components/Topbar/Topbar';
import PowerCard from './Components/UI/PowerCard';
import ToastBox from './Components/UI/ToastBox';

import ReactCountryFlag from 'react-country-flag';
import getCountryISO2 from 'country-iso-3-to-2';

import axios from 'axios';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(StoreContext);
  const { mapSelection, aggregateData, countryData, comparison } = state;

  // if mapSelection is not in the dataset, then remove it as a choice and toast
  useEffect(() => {
    mapSelection && !aggregateData.A3Mappings[mapSelection] && dispatch({
      type: 'SET_MAP_SELECTION',
      payload: null
    });

    mapSelection && !aggregateData.A3Mappings[mapSelection] && dispatch({
      type: 'QUEUE_TOAST',
      payload: {
        icon: "ban-circle",
        intent: Intent.WARNING,
        message: 'No data for this country.'
      }
    })
  }, [dispatch, mapSelection, aggregateData])

  // populate initial aggregate data
  useEffect(() => {
    (async() => {
      const res = await axios('/api/aggregate/', { method: 'get'});
      
      !!res.data && dispatch({
        type: "SET_AGGREGATE_DATA",
        payload: res.data
      })

      !!res.data && setLoading(false)
    })();
  }, [dispatch])

  useEffect(() => {
    aggregateData && mapSelection in aggregateData.A3Mappings && !(mapSelection in countryData) &&
      axios(`/api/country/${mapSelection}`, { method: 'get' } ).then(({data}) => dispatch({
        type: "ADD_COUNTRY_DATA",
        payload: {
          country: mapSelection,
          data
        }
      }));
  }, [mapSelection,dispatch,aggregateData,countryData])

  return loading ? (<div>...</div>) : (
    <Topbar>
      <div className="row">
        <div className="column left">
          <PowerCard
            mapSelection={mapSelection}
            cardType="map"
            comparisonEnabled={!!comparison[0] && !!comparison[1] ? true : false}
            title={!mapSelection ? 'Selection Map' : `${aggregateData.A3Mappings[mapSelection]?.long} Power Plants` }
          >
            <GlobeMap />
          </PowerCard>
          <PowerCard
            mapSelection={mapSelection}
            cardType="comparison"
            comparisonEnabled={!!comparison[0] && !!comparison[1] ? true : false}
            title={
              !!comparison[0] && !!comparison[1] ? (
                <>
                  Comparison:
                  {' '}
                  <ReactCountryFlag svg countryCode={getCountryISO2(comparison[0]) || 'XK'} />
                  {' '}
                  { aggregateData.A3Mappings[comparison[0]].long } vs.
                  {' '}
                  <ReactCountryFlag svg countryCode={getCountryISO2(comparison[1]) || 'XK'} />
                  {' '}
                  {aggregateData.A3Mappings[comparison[1]].long}
                </>) : "Comparison: Select Two Countries to Compare"
              }
          >
            <ComparisonPanel
              country1={!!comparison[0] && !!comparison[1] && comparison[0]}
              country2={!!comparison[0] && !!comparison[1] && comparison[1]}
            />
          </PowerCard>
        </div>
        <div className="column right">
          <PowerCard
            mapSelection={mapSelection}
            cardType="datapanel"
            title={!mapSelection ? 'Global Aggregates' : aggregateData.A3Mappings[mapSelection] ? <><ReactCountryFlag svg countryCode={getCountryISO2(mapSelection) || 'XK'} />{' '}{aggregateData.A3Mappings[mapSelection].long} Production</> : 'Global Aggregates' }
          >
            <DataPanel />
          </PowerCard>
        </div>
      </div>
      <ToastBox />
    </Topbar>
  );
}

export default App;

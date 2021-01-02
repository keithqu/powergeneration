import { useContext, useEffect, useState } from 'react';
import { StoreContext } from './context/Store';

import { Intent } from '@blueprintjs/core';

import DataPanel from './Components/DataPanel/DataPanel';
import GlobeMap from './Components/Map/GlobeMap';
import Topbar from './Components/Topbar/Topbar';
import PowerCard from './Components/UI/PowerCard';
import ToastBox from './Components/UI/ToastBox';

import axios from 'axios';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(StoreContext);
  const { mapSelection, aggregateData, countryData } = state;

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
        intent: Intent.DANGER,
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
            cardType="selectionmap"
            title={!mapSelection ? 'Selection Map' : `${aggregateData.A3Mappings[mapSelection]?.long} Power Plants` }
          >
            <GlobeMap />
          </PowerCard>
        </div>
        <div className="column right">
          <PowerCard
            cardType="datapanel"
            title={!mapSelection ? 'Aggregates (GWh)' : aggregateData.A3Mappings[mapSelection] ? `${aggregateData.A3Mappings[mapSelection].long} Production` : 'Aggregates (GWh)' }
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

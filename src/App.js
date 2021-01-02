import { useContext, useEffect, useState } from 'react';
import { StoreContext } from './context/Store';

import DataPanel from './Components/DataPanel/DataPanel';
import GlobeMap from './Components/Map/GlobeMap';
import Topbar from './Components/Topbar/Topbar';
import PowerCard from './Components/UI/PowerCard'

import axios from 'axios';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(StoreContext);
  const { mapSelection, aggregateData } = state;

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

  return loading ? (<div>...</div>) : (
    <Topbar>
      <div className="row">
        <div className="column left">
          <PowerCard
            title="Selection Map"
            content="hello"
          >
            <GlobeMap />
          </PowerCard>
        </div>
        <div className="column right">
          <PowerCard
            title={!mapSelection ? 'Total Production by Country (GWh)' : aggregateData.A3Mappings[mapSelection] ? `${aggregateData.A3Mappings[mapSelection]} Production` : 'No data for this country'}
          >
            <DataPanel />
          </PowerCard>
        </div>
      </div>
    </Topbar>
  );
}

export default App;

import { useContext } from 'react';
import { StoreContext } from '../../context/Store';

import Aggregates from './Aggregates';
import Country from './Country';

const panelSelector = state => {
  const { mapSelection, aggregateData } = state;
  switch (true) {
    case !mapSelection:
      return <Aggregates />
    case !!mapSelection && !!aggregateData.A3Mappings[mapSelection]:
      return <Country />
    default:
      return <Aggregates />;
  }
}

const DataPanel = () => {
  const [state,] = useContext(StoreContext);

  return (
    <div className="datapanel">
      { panelSelector(state) }
    </div>
  )
}

export default DataPanel;

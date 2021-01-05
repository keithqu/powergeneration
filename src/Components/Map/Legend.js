import { useContext } from 'react';
import { StoreContext } from '../../context/Store';

const Legend = () => {
  const [state, ] = useContext(StoreContext);
  const { mapSelection } = state;

  return !mapSelection ? (
    <div className='map-legend aggregate'>
      <div className='legend-header'>Aggregate Production (GWh)</div>
      <div className='legend-gradient' />
      <div className='legend-gradient-labels'>
        <div className='left'>0</div>
        <div className='right'>2,000,000+</div>
      </div>
    </div>
  ) : (
    <div className='map-legend country'>
      <div className='legend-header'>Fuel Types</div>
      <div className='legend-fuel'>
        <div className='legend-fuel-bg coal' />
        <div className='legend-fuel-text'>Coal</div>
      </div>
      <div className='legend-fuel'>
        <div className='legend-fuel-bg hydro' />
        <div className='legend-fuel-text'>Hydro</div>
      </div>
      <div className='legend-fuel'>
        <div className='legend-fuel-bg nuclear' />
        <div className='legend-fuel-text'>Nuclear</div>
      </div>
      <div className='legend-fuel'>
        <div className='legend-fuel-bg gas' />
        <div className='legend-fuel-text'>Gas</div>
      </div>
      <div className='legend-fuel'>
        <div className='legend-fuel-bg solar' />
        <div className='legend-fuel-text'>Solar</div>
      </div>
      <div className='legend-fuel'>
        <div className='legend-fuel-bg wind' />
        <div className='legend-fuel-text'>Wind</div>
      </div>
      <div className='legend-fuel'>
        <div className='legend-fuel-bg other' />
        <div className='legend-fuel-text'>All Others</div>
      </div>
    </div>
  );
}

export default Legend;

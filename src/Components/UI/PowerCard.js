import { memo, useCallback, useContext } from 'react';
import { StoreContext } from '../../context/Store';

import { Alignment, Button, Card, Elevation, Navbar, NavbarHeading } from '@blueprintjs/core';

import ComparisonSelector from './ComparisonSelector';

const PowerCard = memo(({ cardType, title, comparisonEnabled, mapSelection, children }) => {
  const [state, dispatch] = useContext(StoreContext);
  const { comparison } = state;

  const clearComparisons = useCallback (() => dispatch({ type: 'CLEAR_COMP' }), [dispatch]);

  const handleCloseMap = () => dispatch({ type: 'SET_MAP_SELECTION', payload: null });

  return (
    <Card elevation={Elevation.ONE} style={{ padding: 0 }} className={`powercard ${cardType || ''} ${comparisonEnabled ? 'comparisonEnabled' : 'comparisonDisabled'}`}>
      <Navbar style={{ borderRadius: '5px 5px 0 0', height: '30px' }} elevation={Elevation.TWO} >
        <NavbarHeading style={{ position: 'absolute', top: '4px', fontWeight: 500 }}>
          {title}
        </NavbarHeading>
        {
          cardType === 'map' && mapSelection &&
            <Navbar.Group align={Alignment.RIGHT} style={{ height: 'auto' }}>
              <Button icon="filter-remove" onClick={handleCloseMap} minimal={true} text="Remove selection" />
            </Navbar.Group>
        }
        {
          cardType === 'comparison' && <ComparisonSelector somethingSelected={!!comparison[0] || !!comparison[1]} clearComparisons={clearComparisons} />
        }
      </Navbar>
      <div className="content">
        { children }
      </div>
    </Card>
  )
});

export default PowerCard;

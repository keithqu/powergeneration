import { useContext } from 'react';
import { StoreContext } from '../../context/Store';

import { Alignment, Button, Card, Elevation, Icon, Navbar, NavbarHeading } from '@blueprintjs/core';

const PowerCard = ({ cardType, title, children }) => {
  const [state, dispatch] = useContext(StoreContext);
  const { mapSelection } = state;

  const handleCloseMap = () => dispatch({ type: 'SET_MAP_SELECTION', payload: null });

  return (
    <Card elevation={Elevation.ONE} style={{ padding: 0 }} className="powercard">
      <Navbar style={{ borderRadius: '5px 5px 0 0', height: '30px' }} elevation={Elevation.TWO} >
        <NavbarHeading style={{ position: 'absolute', top: '4px', fontWeight: 500 }}>
          {title}
        </NavbarHeading>
        {
          cardType === 'selectionmap' && mapSelection &&
            <Navbar.Group align={Alignment.RIGHT} style={{ height: 'auto' }}>
              <Button icon="filter-remove" onClick={handleCloseMap} minimal={true} text="Remove selection" />
            </Navbar.Group>
        }
      </Navbar>
      <div className="content">
        { children }
      </div>
    </Card>
  )
}

export default PowerCard;

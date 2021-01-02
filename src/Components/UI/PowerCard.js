import { Card, Elevation, Navbar, NavbarHeading } from '@blueprintjs/core';

const PowerCard = ({ title, children }) => {
  return (
    <Card elevation={Elevation.ONE} style={{ padding: 0 }} className="powercard">
      <Navbar style={{ borderRadius: '5px 5px 0 0', height: '30px' }} elevation={Elevation.TWO} >
        <NavbarHeading style={{ position: 'absolute', top: '4px', fontWeight: 500 }}>
          {title}
        </NavbarHeading>
      </Navbar>
      <div className="content">
        { children }
      </div>
    </Card>
  )
}

export default PowerCard;

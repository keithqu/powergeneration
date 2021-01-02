import { Alignment, Icon, Navbar, NavbarDivider, NavbarGroup, NavbarHeading } from '@blueprintjs/core';

const Topbar = ({ children }) => {
  return (
    <div className='wrapper'>
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading style={{fontWeight: 700, fontSize: '1.4em' }}>
            <Icon icon="lightbulb" style={{ position: 'relative', top: '-4px' }} />
            Global Power Generation
          </NavbarHeading>
          <NavbarDivider />
          Searchbar here
        </NavbarGroup>
      </Navbar>
      <div className='underwrapper'>
        { children }
      </div>
    </div>
  )
}

export default Topbar;
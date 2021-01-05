import { useState } from 'react';
import { Alignment, Button, Classes, Dialog, Icon, Navbar, NavbarDivider, NavbarGroup, NavbarHeading } from '@blueprintjs/core';

const Topbar = ({ children }) => {
  const [about, setAbout] = useState(false);

  const handleAbout = bool => setAbout(bool);

  return (
    <div className='wrapper'>
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading style={{fontWeight: 700, fontSize: '1.4em' }}>
            <Icon icon="lightbulb" style={{ position: 'relative', top: '-4px' }} />
            Global Power Generation
          </NavbarHeading>
          <NavbarDivider />
          What kinds of fuels do we depend on for electiricty? Select a country on the map or aggregates list to explore!
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <NavbarDivider />
          <Button icon='help' minimal={true} onClick={() => handleAbout(true)} />
          <Dialog
            className='about-dialog'
            icon='help'
            title='About'
            onClose={() => handleAbout(false)}
            isOpen={about}
          >
            <div className={Classes.DIALOG_BODY}>
              <p>
                This dashboard covers nearly 30,000 power plants in 164 countries with unmodified <a rel="noreferrer" target="_blank" href="https://datasets.wri.org/dataset/globalpowerplantdatabase">data</a> from the <a rel="noreferrer" target="_blank" href="https://wri.org/">World Resources Institute</a>.
              </p>
              <p>
                One of the goals is to visualize dependence on certain types of fuel, especially those with high carbon emissions, such as coal.
                It's interesting to see the effects of France's pro-nuclear power policies, as well as the oil and gas dependence of Middle Eastern countries.
              </p>
              <p>Power generation numbers are either the 2017 reported figure or a 2018 estimate, whichever is available.</p>
              <p>The estimate for A.E.S. Corp in USA/Puerto Rico is almost certainly incorrect, unless a modestly sized coal plant is really the largest producer in the world.</p>
              <p>ResourceWatch has a <a rel="noreferrer" target="_blank" href="https://resourcewatch.org/data/explore/Powerwatch">capacity map</a> from the same data.</p>
              <p>Created under <a rel="noreferrer" target="_blank" href="https://creativecommons.org/licenses/by/4.0/legalcode">Creative Commons Attribution 4.0 International License</a>.</p>
            </div>
          </Dialog>
        </NavbarGroup>
      </Navbar>
      <div className='underwrapper'>
        { children }
      </div>
    </div>
  )
}

export default Topbar;
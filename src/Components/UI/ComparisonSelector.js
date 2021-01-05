import { memo } from 'react';

import { Alignment, Button, Navbar } from '@blueprintjs/core';

import CountrySearch from './CountrySearch';

const ComparisonSelector = memo(({ somethingSelected, clearComparisons }) => {
  return (
    <Navbar.Group align={Alignment.RIGHT} style={{ height: 'auto' }}>
      { somethingSelected && <Button icon="filter-remove" minimal={true} text="Clear" onClick={clearComparisons} />}
      <CountrySearch target="comparison1" />
      <CountrySearch target="comparison2" />
    </Navbar.Group>
  )
});

export default ComparisonSelector;

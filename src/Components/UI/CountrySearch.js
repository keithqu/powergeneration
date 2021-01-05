import { useContext } from 'react';
import { StoreContext } from '../../context/Store';

import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

const CountrySearch = ({ target }) => {
  const [state, dispatch] = useContext(StoreContext);
  const { aggregateData } = state;
  const t = target === 'search' ? null : target === 'comparison1' ? state.comparison[0] : state.comparison[1];

  const filterItem = (query, item, index, exactMatch) => {
    const normalizedCountry = item.long.toLowerCase();
    const normalizedCode = item.code.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    return exactMatch ? normalizedCountry === normalizedQuery || normalizedCode === normalizedQuery : `${normalizedCountry} ${normalizedCode}`.indexOf(normalizedQuery) >= 0;
  }

  const renderItem = (item, { handleClick, modifiers, query }) => {
    if (!modifiers.matchesPredicate) return null;
    const text = item.long
    return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        label={item.code}
        key={`${item.code}-${item.long}`}
        onClick={handleClick}
        text={text}
      />
    )
  }

  const handleSelect = item => {
    target === 'search' ? dispatch() : dispatch({
      type: target === 'comparison1' ? 'SET_COMP_ONE' : 'SET_COMP_TWO',
      payload: item.code
    });
  }

  const areEqual = (country1, country2) => country1.code.toLowerCase() === country2.code.toLowerCase();

  return (
    <Select
      popoverClassName='popover-menu'
      items={aggregateData.searchItems}
      itemPredicate={filterItem}
      itemRenderer={renderItem}
      itemsEqual={areEqual}
      noResults={<MenuItem disabled={true} text="No results..." />}
      onItemSelect={handleSelect}
      popoverProps={{ minimal: true }}
    >
      <Button
        icon='flag'
        rightIcon='caret-up'
        text={t ? t : '(Select)'}
       /> 
    </Select>
  )
}

export default CountrySearch;

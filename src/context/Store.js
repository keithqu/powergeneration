// Context api for global state values
// Works with a redux-style type/payload framework
import { createContext, useMemo, useReducer } from 'react';

import { centroids } from '../util/centroids';

export const combineReducers = slices => (state, action) =>
  Object.keys(slices).reduce((acc,prop) => ({
    ...acc,
    [prop]: slices[prop](acc[prop], action)
  }), state)

const initialState = {
  mapboxToken: 'pk.eyJ1Ijoia2VpdGhxdSIsImEiOiJjamV2eHQwenY1NHprMndtZXQyM3Vqcmh0In0.3_OCDmXVl48_dwoNmq3YBQ',
  mapSelection: null,
  comparison: [null, null],
  centroids: centroids,
  aggregateData: null,
  countryData: {},
  fuelAggregates: null,
  countryFuelAggregates: null,
  toasts: []
}

const colorSwitcher = fuel => {
  switch (fuel.toLowerCase()) {
    case 'coal':
      return '#00000055';
    case 'hydro':
      return '#6495ED55';
    case 'nuclear':
      return '#FFD70055';
    case 'gas':
      return '#80000055';
    case 'oil':
      return '#70809055';
    case 'soloar':
      return '#FF8C0055';
    case 'wind':
      return '#00808055';
    default:
      return '#D2B48C55';
  }
}

const rootReducer = combineReducers({
  mapboxToken: (state, action) => {
    switch(action.type) {
      default:
        return state
    }
  },
  comparison: (state, action) =>{
    switch(action.type) {
      case 'SET_COMP_ONE':
        return action.payload !== state[1] ? [action.payload, state[1]] : state;
      case 'SET_COMP_TWO':
        return action.payload !== state[0] ? [state[0], action.payload] : state;
      case 'CLEAR_COMP':
        return [];
      default:
        return state;
    }
  },
  mapSelection: (state, action) => {
    switch(action.type) {
      case 'SET_MAP_SELECTION':
        return action.payload
      default:
        return state
    }
  },
  aggregateData: (state, action) => {
    switch(action.type) {
      case 'SET_AGGREGATE_DATA':
        return {
          production: action.payload,
          A3Mappings: action.payload.reduce((map,obj) => {
            map[obj.country] = {}
            map[obj.country].long = obj.country_long;
            map[obj.country].total = obj.total
            return map;
          }, {}),
          searchItems: action.payload.reduce((arr,obj) => {
            return [
              ...arr,
              { code: obj.country, long: obj.country_long }
            ];
          }, []).sort((a,b) => a.long.localeCompare(b.long))
        };
      default:
        return state;
    }
  },
  countryData: (state, action) => {
    switch(action.type) {
      case 'ADD_COUNTRY_DATA':
        const grandTotal = action.payload.data.fuel.map(d => d.total).reduce((a,b) => a+b);
        return action.payload.country in state ? state : {
          ...state,
          [action.payload.country]: { 
            ...action.payload.data,
            pct: action.payload.data.fuel.map(d => ({
              id: d.primary_fuel,
              label: d.primary_fuel,
              value: (d.total/grandTotal*100).toFixed(1),
              color: colorSwitcher(d.primary_fuel)
            })),
            bar: [action.payload.data.fuel.reduce((map,obj) => {
              return {
                ...map,
                [obj.primary_fuel]: obj.total,
                [`${obj.primary_fuel}Color`]: colorSwitcher(obj.primary_fuel)
              }
            }, { country: action.payload.country })],
            barKeys: action.payload.data.fuel.map(d => d.primary_fuel).reverse()
          }
        };
      default:
        return state;
    }
  },
  fuelAggregates: (state, action) => {
    switch(action.type) {
      case 'SET_FUEL_AGGREGATES':
        const grandTotal = action.payload.map(d => d.total).reduce((a,b) => a+b);
        return {
          reg: action.payload,
          pct: action.payload.map(d => ({
            id: d.primary_fuel,
            label: d.primary_fuel,
            value: (d.total/grandTotal*100).toFixed(1),
            color: colorSwitcher(d.primary_fuel)
          })),
          bar: [action.payload.reduce((map,obj) => {
            return {
              ...map,
              [obj.primary_fuel]: obj.total,
              [`${obj.primary_fuel}Color`]: colorSwitcher(obj.primary_fuel)
            }
          }, { country: 'world' })],
          barKeys: action.payload.map(d => d.primary_fuel).reverse()
        };
      default:
        return state;
    }
  },
  countryFuelAggregates: (state, action) => {
    switch(action.type) {
      case 'SET_CFUEL_AGGREGATES':
        return action.payload;
      default:
        return state;
    }
  },
  toasts: (state, action) => {
    switch(action.type) {
      case "CLEAR_TOASTS":
        return [];
      case "QUEUE_TOAST": {
        return [
          ...state,
          action.payload,
        ]
      }
      default:
        return state;
    }
  }
});

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  const store = useMemo(() => [state, dispatch], [state]);

  return (
    <StoreContext.Provider value={store}>
      { children }
    </StoreContext.Provider>
  );
}

export default StoreProvider;

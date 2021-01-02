// Context api for global state values
// Works with a redux-style type/payload framework
import { createContext, useMemo, useReducer } from 'react';
export const combineReducers = slices => (state, action) =>
  Object.keys(slices).reduce((acc,prop) => ({
    ...acc,
    [prop]: slices[prop](acc[prop], action)
  }), state)

const initialState = {
  mapboxToken: 'pk.eyJ1Ijoia2VpdGhxdSIsImEiOiJjamV2eHQwenY1NHprMndtZXQyM3Vqcmh0In0.3_OCDmXVl48_dwoNmq3YBQ',
  mapSelection: null
}

const rootReducer = combineReducers({
  mapboxToken: (state, action) => {
    switch(action.type) {
      default:
        return state
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
            map[obj.country] = obj.country_long;
            return map;
          }, {})
        };
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

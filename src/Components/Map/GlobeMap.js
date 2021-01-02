import { useContext } from 'react';
import { StoreContext } from '../../context/Store';

import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  // Marker
} from "react-simple-maps"
// import polylabel from 'polylabel';
import { countrypoly } from '../../util/countrypoly';

// console.log(countrypoly.objects.ne_110m_admin_0_countries.geometries)

const mapStyles = {
  width: "100%",
  margin: 0,
  display: "block",
  height: "100%",
  padding: '1px'
}

const GlobeMap = () => {
  const [state, dispatch] = useContext(StoreContext);

  const handleClick = geo => {
    dispatch({
      type: "SET_MAP_SELECTION",
      payload: state.mapSelection === geo.properties.ISO_A3 ? null : geo.properties.ISO_A3
    });
  }

  return (
    <ComposableMap
      width={500}
      height={500}
      projection="geoMercator"
      projectionConfig={{ scale: 175 }}
      style={mapStyles}
    >
      <ZoomableGroup>
        <Geographies
          // geography="https://unpkg.com/world-atlas@1.1.4/world/110m.json"
          geography={countrypoly}
        >
          {
            geos => geos.geographies.map((geo,i) => 
              <Geography
                key={`${geo.id}-${i}`}
                geography={geo}
                onClick={() => handleClick(geo)}
                style={{
                  pressed: {
                    outline: 'none'
                  },
                  default: {
                    outline: 'none',
                    fill: state.mapSelection === geo.properties.ISO_A3 ? '#ff6600' : "#68a6d5",
                  },
                  hover: {
                    outline: 'none',
                    fill: state.mapSelection === geo.properties.ISO_A3 ? '#ff6600' : '#ff0000'
                  },
                }}
              />
            )
          }
        </Geographies>
        {/* {
          countrypoly.objects.ne_110m_admin_0_countries.geometries.map((geo,i) => {
            // console.log(geo)
            return <Marker
              key={`${geo.id}-${i}-marker`}
              coordinates={polylabel(geo.geometry.coordinates, 1.0)}
            >
              <text textAnchor="middle" fill="#ff0000" style={{
                fontFamily: "Raleway",
                fontSize: "0.4em",
                zIndex: 9999
              }} >
                { geo.properties.FORMAL_EN }
              </text>
            </Marker>
          })
        } */}
      </ZoomableGroup>
    </ComposableMap>
  )
}

export default GlobeMap;
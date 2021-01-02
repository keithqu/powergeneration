import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/Store';

import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps"
import { countrypoly } from '../../util/countrypoly';

const mapStyles = {
  width: "100%",
  margin: 0,
  display: "block",
  height: "100%",
  padding: '1px'
}

const colorScale = scaleLinear()
  .domain([0, 8])
  .range(["#bbbbbb", "#68a6d5"]);

const GlobeMap = () => {
  const [position, setPosition] = useState({
    coordinates: [0,0],
    zoom: 1
  })
  const [state, dispatch] = useContext(StoreContext);
  const { aggregateData, centroids, mapSelection, countryData } = state;

  // Multiple ways to change mapSelection so better off as a listener
  useEffect(() => {
    mapSelection in aggregateData.A3Mappings && setPosition({
      coordinates: centroids[mapSelection],
      zoom: position.zoom > 2.5 ? position.zoom : 2.5
    })
  } ,[mapSelection,aggregateData,centroids,position])

  const handleMoveEnd = position => setPosition(position)

  const handleClick = geo => {
    dispatch({
      type: "SET_MAP_SELECTION",
      payload: geo.properties.ISO_A3
    });
  }

  const handleClickMarker = data => {
    console.log(data)
  }

  const handleCircleRadius = production => {
    switch (true) {
      case production >= 50000:
        return 5.0;
      case production >= 40000:
        return 4.0;
      case production >= 30000:
        return 3.0;
      case production >= 20000:
        return 2.0;
      case production >= 10000:
        return 1.0;
      case production >= 5000:
        return 0.5;
      default:
        return 0.4;
    }
  }

  return (
    <ComposableMap
      width={500}
      height={500}
      projection="geoMercator"
      projectionConfig={{ scale: 175 }}
      style={mapStyles}
    >
      <ZoomableGroup center={position.coordinates} zoom={position.zoom} onMoveEnd={handleMoveEnd}>
        <Geographies geography={countrypoly}>
          {
            geos => geos.geographies.map((geo,i) => {
              return <Geography
                key={`${geo.id}-${i}`}
                geography={geo}
                onClick={() => handleClick(geo)}
                style={{
                  pressed: {
                    outline: 'none'
                  },
                  default: {
                    outline: 'none',
                    fill: state.mapSelection === geo.properties.ISO_A3 ? '#ff0000aa' : geo.properties.ISO_A3 in aggregateData.A3Mappings ? colorScale(aggregateData.A3Mappings[geo.properties.ISO_A3]?.total/5621544*100) : "#eeeeee",
                  },
                  hover: {
                    outline: 'none',
                    fill:'#ff0000cc'
                  },
                }}
              />
              })
          }
        </Geographies>
        {
          mapSelection in countryData && countryData[mapSelection].map(d => (
            <Marker
              key={`${d.country}-${d.id}`}
              coordinates={[d.longitude,d.latitude]}
            >
              <circle
                r={handleCircleRadius(Math.max(d.generation_gwh_2017,d.estimated_generation_gwh))}
                fill="#36529477"
                onClick={() => handleClickMarker(d)}
              />
            </Marker>
          ))
        }
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
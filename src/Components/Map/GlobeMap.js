import { Fragment, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StoreContext } from '../../context/Store';

import { scaleLinear } from "d3-scale";
import { Circle, GeoJSON, MapContainer, Popup, TileLayer } from 'react-leaflet'

import Legend from './Legend';
import PowerPlantPopover from './PowerPlantPopover';

import { countrypoly } from '../../util/geojson';

const mapStyles = {
  width: "100%",
  display: "block",
  height: "100%",
}

const colorScale = scaleLinear()
  .domain([1, 40])
  .range(["#e5f5e0", "#31a354"]); 
  // hot pink for some reason          
  // .range(['#ff69b4','#ff1493'])

const MapPosition = ({ map }) => {
  const [state, ] = useContext(StoreContext);
  const { centroids, mapSelection } = state;

  // forcePosition only changes when the mapselection changes and only useeffect ensures that
  // the map only focuses and zooms when there's an actual country selected
  const forcePosition = useMemo(() => centroids[mapSelection], [centroids,mapSelection]);

  useEffect(() => {
    const currentZoom = map.getZoom();
    mapSelection && forcePosition && map.setView([forcePosition[1],forcePosition[0]], currentZoom > 5 ? currentZoom : 5);
    !mapSelection && !forcePosition && map.setView([0,0], 3);
  } ,[forcePosition,map,mapSelection]);

  return (<></>);
}

const GlobeMap = () => {
  const [map, setMap] = useState(null);
  const [state, dispatch] = useContext(StoreContext);
  const { aggregateData, countryData, mapSelection } = state;

  const handleClick = useCallback(e => {
    dispatch({
      type: "SET_MAP_SELECTION",
      payload: e.sourceTarget.feature.properties.ISO_A3
    });
  }, [dispatch]);

  // scaling radius by the production value works pretty well
  const handleCircleRadius = production => {
    switch (true) {
      case production > 2000:
        return production * 1.5;
      default:
        return 3000;
    }
  }

  const handlePlantColor = fuel => {
    switch (fuel.toLowerCase()) {
      case 'coal':
        return '#000000EE';
      case 'hydro':
        return '#6495EDEE';
      case 'nuclear':
        return '#FFD700EE';
      case 'gas':
        return '#800000EE';
      case 'oil':
        return '#708090EE';
      case 'soloar':
        return '#FF8C00EE';
      case 'wind':
        return '#008080EE';
      default:
        return '#D2B48CEE'
    }
  }

  const showMap = useMemo(() => (
    <MapContainer
      center={[0,0]}
      zoom={3}
      scrollWheelZoom={true}
      style={mapStyles}
      whenCreated={setMap}
      worldCopyJump={true}
    >
      {
        countrypoly.features.map(f => (
          // using the magic of key changes to update when needed...
          <GeoJSON
            key={`${f.properties.ISO_A3}-${f.properties.NAME_LONG}-geojson-map-${mapSelection === f.properties.ISO_A3}`}
            data={f}
            style={{
              fillColor: mapSelection === f.properties.ISO_A3 ? '#ff000022' : f.properties.ISO_A3 in aggregateData.A3Mappings ? colorScale(aggregateData.A3Mappings[f.properties.ISO_A3]?.total/5621544*100) : '#eeeeee',
              fillOpacity: 0.5,
              stroke: false
              // stroke: mapSelection === f.properties.ISO_A3 ? true : false,
              // color: '#ff0000',
              // opacity: 0.5,
            }}
            eventHandlers={{
              click: e => handleClick(e)
            }}
          />
        ))
      }
      <TileLayer
        // noWrap={true}
        // bounds={[[-90,-180],[90,180]]}
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
        {
          mapSelection in countryData && countryData[mapSelection].power.map(d => (
            <Circle
              key={`${d.country}-${d.id}`}
              center={[d.latitude,d.longitude]}
              radius={handleCircleRadius(Math.max(d.generation_gwh_2017,d.estimated_generation_gwh))}
              pathOptions={{
                fillColor: handlePlantColor(d.primary_fuel),
                stroke: false,
                fillOpacity: 0.6
              }}
            >
              <Popup>
                <PowerPlantPopover data={d} />
              </Popup>
            </Circle>
          ))
        }
    </MapContainer>
  ), [mapSelection,aggregateData,handleClick,countryData])

  return (
    <Fragment>
      { map ? <MapPosition map={map} /> : null }
      { showMap }
      <Legend />
    </Fragment>
  )
}

export default GlobeMap;

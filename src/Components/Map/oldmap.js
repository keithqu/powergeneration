import { useContext, useRef, useState } from 'react';
import { StoreContext } from '../../context/Store';
import MapGL, { Marker, Layer, Source } from 'react-map-gl';

const Map = () => {
  const mapRef = useRef();
  const [state, dispatch] = useContext(StoreContext);
  const [viewport, setViewport] = useState({
    longitude: -79.3832,
    latitude: 43.6532,
    zoom: 2
  });
  
  const handleViewportChange = view => setViewport({
    ...viewport,
    ...view
  })
  const handleClick = e => console.log(e.lngLat, e)

  return (
    <MapGL
      className='mainmap'
      ref={mapRef}
      {...viewport}
      mapStyle='mapbox://styles/keithqu/ckjeit41r22g419miav1rsjzj'
      mapboxApiAccessToken={state.mapboxToken}
      onViewportChange={handleViewportChange}
      onClick={e => handleClick(e)}
      width="100%"
      height="100%"
    >

    </MapGL>
  )
}

export default Map;

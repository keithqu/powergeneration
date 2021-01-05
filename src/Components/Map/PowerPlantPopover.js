import { Callout, Card, Elevation, Intent } from '@blueprintjs/core';

const PowerPlantPopover = d => {
  const { data } = d
  const isEst = data.estimated_generation_gwh > data.generation_gwh_2017;

  return (
    <Card className='map-popup-card' elevation={Elevation.TWO} >
      <Callout
        title={data.name}
        intent={Intent.PRIMARY}
      >
        <div>Commissioned: <strong>{!!data.commissioning_year ? data.commissioning_year : 'no record'}</strong></div>
        <div>Primary Fuel: <strong>{data.primary_fuel}</strong></div>
        { !!data.other_fuel1 && <div>Other Fuel: <strong>{data.other_fuel1}</strong></div> }
        { !!data.other_fuel2 && <div>Other Fuel: <strong>{data.other_fuel2}</strong></div> }
        { !!data.other_fuel3 && <div>Other Fuel: <strong>{data.other_fuel3}</strong></div> }
        <div>Capacity (MW): <strong>{data.capacity_mw}</strong></div>
        {
          isEst ? (
            <div>2018 Est. Production (GWh): <strong>{data.estimated_generation_gwh}</strong></div>
          ) : (
            <div>2017 Production (GWh): <strong>{data.generation_gwh_2017}</strong></div>
          )
        }
        {
          data.source.split(';').map((s,i) => (
            <div key={`${s.source}-${i}`}>Source: <strong><a rel="noreferrer" target="_blank" href={data.url.split(';')[i]}>{s}</a></strong></div>
          ))
        }
      </Callout>
    </Card>
  )
}

export default PowerPlantPopover;

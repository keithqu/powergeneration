import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/Store';

import { Callout } from '@blueprintjs/core';

import axios from 'axios';

const ComparisonPanel = () => {
  const [local, setLocal] = useState(null)
  const [state, dispatch] = useContext(StoreContext);
  const { comparison } = state;

  useEffect(() => {
    (async () => {
      const res = !!comparison[0] && !!comparison[1] &&
        await axios(`/api/comparison/${comparison[0]}/${comparison[1]}`, { method: 'get' })
      
      res && setLocal(res.data)
    })();
  }, [comparison])

  console.log(local)

  return (
    <>
      {
        !!comparison[0] && !!comparison[1] && (
          <Callout
            title="Comparisons!"
          >
            hello
          </Callout>
        )
      }
    </>
  )
}

export default ComparisonPanel;

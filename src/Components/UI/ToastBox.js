// Blueprint's toaster uses legacy context API elements and findDOMNode
// These give off warnings in dev; need to wait for an update to fix these
import { useContext, useEffect, useRef } from 'react';
import { StoreContext } from '../../context/Store';

import {
  Toaster,
  Position,
} from '@blueprintjs/core';

const ToastBox = () => {
  let toaster = useRef();
  const refHandlers = {
    toaster: ref => toaster = ref
  }
  const [state, dispatch] = useContext(StoreContext);
  const { toasts } = state;

  useEffect(() => {
    toasts.length > 0 && toasts.forEach(toast => {
      toast.timeout = 5000;
      toaster.show(toast)
    })
    toasts.length > 0 && dispatch({
      type: 'CLEAR_TOASTS'
    })
  }, [dispatch, toasts])

  return (
    <Toaster position={Position.BOTTOM_RIGHT} ref={refHandlers.toaster} />
  )
}

export default ToastBox;

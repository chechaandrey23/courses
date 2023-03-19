import {useEffect, useRef} from 'react';

export function useFirst() {
  const ref = useRef(true);
  useEffect(() => {
    ref.current = false;
  }, []);
  return ref;
}

import { useEffect } from 'react';

export function useQuery(effect, deps = []) {
  useEffect(() => {
    effect();
  }, deps);
}

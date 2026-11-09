import { useEffect, useState, type DependencyList } from 'react';

type ResourceSnapshot<T> = {
  key: string;
  version: number;
  data: T | null;
  error: string;
};

type ResourceState<T> = {
  data: T | null;
  loading: boolean;
  error: string;
  reload: () => void;
};

export function useResource<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
): ResourceState<T> {
  const [snapshot, setSnapshot] = useState<ResourceSnapshot<T> | null>(null);
  const [version, setVersion] = useState(0);
  const key = JSON.stringify(deps) ?? String(deps.length);
  const isCurrent = snapshot?.key === key && snapshot.version === version;

  useEffect(() => {
    let active = true;

    Promise.resolve()
      .then(loader)
      .then((data) => {
        if (active) {
          setSnapshot({ key, version, data, error: '' });
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setSnapshot({
            key,
            version,
            data: null,
            error: reason instanceof Error ? reason.message : 'Could not load this information.',
          });
        }
      });

    return () => {
      active = false;
    };
    // Callers provide the resource identity in deps; loader closures are intentionally recreated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, key, version]);

  return {
    data: isCurrent ? snapshot.data : null,
    loading: !isCurrent,
    error: isCurrent ? snapshot.error : '',
    reload: () => setVersion((current) => current + 1),
  };
}

import { useCallback, useState } from 'react';

import { PayloadActionCreator } from '@reduxjs/toolkit';

import { useActionWithDeferred } from '@hooks/use-action-with-deferred';

interface IInfinityDeferredParams<TPayload> {
  action: PayloadActionCreator<TPayload>;
  limit: number;
}

export function useInfinityDeferred<TPayload, TResponse>({
  action,
  limit,
}: IInfinityDeferredParams<TPayload>) {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<TResponse[]>([]);

  const request = useActionWithDeferred(action);

  const executeRequest = useCallback(
    async (payload: TPayload) => {
      setLoading(true);
      const res = await request<TResponse[]>(payload);
      setHasMore(res.length >= limit);
      setData((prevData) => [...prevData, ...res]);
      setLoading(false);
    },
    [request, limit],
  );

  return { executeRequest, data, hasMore, loading };
}

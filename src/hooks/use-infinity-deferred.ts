import { useCallback, useState } from 'react';

import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  ActionCreatorWithPreparedPayload
} from '@reduxjs/toolkit';

import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import {Meta} from "@store/common/actions";
import {PayloadAction} from "@reduxjs/toolkit/src/createAction";

interface IInfinityDeferredParams<TPayload> {
  action: PayloadAction<TPayload, string, Meta>;
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

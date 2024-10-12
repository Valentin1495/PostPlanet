import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export const useInfiniteScroll = (queryKey: string[], apiUrl: string) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const { data, isFetchingNextPage, fetchNextPage, status, error } =
    useInfiniteQuery({
      queryKey,
      queryFn: async ({ pageParam }) => {
        const response = await fetch(`${apiUrl}&page=${pageParam}`);
        const { result } = await response.json();

        return result;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return lastPageParam + 1;
      },
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return { data, isFetchingNextPage, status, error, ref };
};

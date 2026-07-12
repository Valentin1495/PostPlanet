'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFollowCacheSync } from '@/hooks/use-follow-cache-sync';
import { ReactNode } from 'react';
import { useState } from 'react';

function FollowCacheSync({ queryClient }: { queryClient: QueryClient }) {
  useFollowCacheSync(queryClient);

  return null;
}

export default function ClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <FollowCacheSync queryClient={queryClient} />
      {children}
    </QueryClientProvider>
  );
}

'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 60000, // 1 minute deduplication window
        revalidateOnFocus: false, // Don't refetch on tab focus
        revalidateOnReconnect: false, // Don't refetch on reconnect
        errorRetryCount: 2, // Limit retries
      }}
    >
      {children}
    </SWRConfig>
  );
}

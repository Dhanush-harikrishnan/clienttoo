'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react'

type Props = { children: React.ReactNode }

const ReactQueryProvider = ({ children }: Props) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // always refetch on mount for cross-page freshness
            gcTime: 5 * 60 * 1000, // keep cache for 5 min (background)
            refetchOnWindowFocus: true,
            refetchOnMount: true,
          },
        },
      })
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export default ReactQueryProvider

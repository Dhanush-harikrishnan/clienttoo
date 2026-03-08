import { getAllAutomations, getAutomationInfo } from '@/actions/automations'
import { onUserInfo } from '@/actions/user'
import { QueryClient, QueryFunction } from '@tanstack/react-query'

const prefetch = async (
  client: QueryClient,
  action: QueryFunction,
  key: string | string[]
) => {
  const queryKey = Array.isArray(key) ? key : [key]
  return await client.prefetchQuery({
    queryKey,
    queryFn: action,
    staleTime: 30000,
  })
}

export const PrefetchUserProfile = async (client: QueryClient) => {
  return await prefetch(client, onUserInfo, 'user-profile')
}

export const PrefetchUserAutnomations = async (client: QueryClient) => {
  return await prefetch(client, getAllAutomations, 'user-automations')
}

export const PrefetchUserAutomation = async (
  client: QueryClient,
  automationId: string
) => {
  return await prefetch(
    client,
    () => getAutomationInfo(automationId),
    ['automation-info', automationId]
  )
}

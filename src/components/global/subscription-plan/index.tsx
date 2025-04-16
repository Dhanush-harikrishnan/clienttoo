import { useQueryUser } from '@/hooks/user-queries'
import React from 'react'

type Props = {
  children: React.ReactNode
  type: string
}

export const SubscriptionPlan = ({ children, type }: Props) => {
  const { data } = useQueryUser()
  return data?.data?.plan === type && children
}

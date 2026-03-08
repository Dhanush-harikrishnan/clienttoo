'use client'
import { onOAuthInstagram } from '@/actions/integrations'
import { onUserInfo } from '@/actions/user'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'

type Props = {
  title: string
  description: string
  icon: React.ReactNode
  strategy: 'INSTAGRAM' | 'CRM'
}

const IntegrationCard = ({ description, icon, strategy, title }: Props) => {

  const onInstaOAuth = () => onOAuthInstagram(strategy)

  const { data } = useQuery({
    queryKey: ['user-profile'],
    queryFn: onUserInfo,
  })

  const integrated = data?.data?.integrations.find(
    (integration) => integration.name === strategy
  )

  // Check token health
  const isExpired = integrated?.expiresAt
    ? new Date(integrated.expiresAt) < new Date()
    : false
  const isExpiringSoon = integrated?.expiresAt
    ? new Date(integrated.expiresAt).getTime() - Date.now() < 5 * 24 * 60 * 60 * 1000
    : false

  return (
    <div className="border-2 border-[#3352CC] rounded-2xl gap-x-5 p-5 flex items-center justify-between">
      {icon}
      <div className="flex flex-col flex-1">
        <h3 className="text-xl"> {title}</h3>
        <p className="text-[#9D9D9D] text-base">{description}</p>
        {integrated && isExpired && (
          <p className="text-orange-400 text-xs mt-1 flex items-center gap-1">
            <AlertTriangle size={12} />
            Token expired — click Reconnect to fix
          </p>
        )}
        {integrated && isExpiringSoon && !isExpired && (
          <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
            <AlertTriangle size={12} />
            Token expiring soon — consider reconnecting
          </p>
        )}
      </div>
      {integrated ? (
        <div className="flex items-center gap-2">
          {!isExpired && (
            <span className="text-green-400 flex items-center gap-1 text-sm">
              <CheckCircle size={14} /> Connected
            </span>
          )}
          <Button
            onClick={onInstaOAuth}
            variant={isExpired ? 'default' : 'outline'}
            className={isExpired
              ? 'bg-gradient-to-br text-white rounded-full from-orange-500 font-medium to-red-600 hover:opacity-70 transition duration-100'
              : 'rounded-full border-slate-600 text-slate-300 hover:text-white hover:border-blue-500 transition duration-100'
            }
          >
            <RefreshCw size={14} className="mr-1" />
            {isExpired ? 'Reconnect' : 'Refresh'}
          </Button>
        </div>
      ) : (
        <Button
          onClick={onInstaOAuth}
          className="bg-gradient-to-br text-white rounded-full text-lg from-[#3352CC] font-medium to-[#1C2D70] hover:opacity-70 transition duration-100"
        >
          Connect
        </Button>
      )}
    </div>
  )
}

export default IntegrationCard

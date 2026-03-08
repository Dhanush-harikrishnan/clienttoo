'use client'

import React from 'react'
import { useQueryAutomations } from '@/hooks/user-queries'
import CreateAutomation from '../create-automation'
import { Check, Zap, ZapOff } from 'lucide-react'
import { getMonth } from '@/lib/utils'

const AutomationsSidebar = () => {
  const { data } = useQueryAutomations()

  const automations = data?.status === 200 ? data.data : []
  const activeAutomations = automations.filter((a: any) => a.active)
  const recentAutomations = automations.slice(0, 5)

  return (
    <div className="flex flex-col rounded-xl bg-background-80 gap-y-6 p-5 border-[1px] overflow-hidden border-in-active">
      <div>
        <h2 className="text-xl">Automations</h2>
        <p className="text-text-secondary text-sm">
          {automations.length === 0
            ? 'Create your first automation to get started.'
            : `${automations.length} total, ${activeAutomations.length} active`}
        </p>
      </div>

      {recentAutomations.length > 0 ? (
        <div className="flex flex-col gap-y-3">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
            Recent
          </p>
          {recentAutomations.map((automation: any) => (
            <div
              key={automation.id}
              className="flex items-start justify-between"
            >
              <div className="flex flex-col min-w-0 flex-1 mr-3">
                <h3 className="font-medium truncate">{automation.name}</h3>
                <p className="text-text-secondary text-sm">
                  {automation.createdAt
                    ? `${getMonth(new Date(automation.createdAt).getUTCMonth() + 1)} ${new Date(automation.createdAt).getUTCDate()}, ${new Date(automation.createdAt).getUTCFullYear()}`
                    : 'No date'}
                </p>
              </div>
              {automation.active ? (
                <Zap size={16} className="text-green-400 flex-shrink-0 mt-1" />
              ) : (
                <ZapOff size={16} className="text-gray-500 flex-shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-2 py-4 text-center">
          <p className="text-gray-400 text-sm">No automations yet</p>
        </div>
      )}

      <CreateAutomation />
    </div>
  )
}

export default AutomationsSidebar

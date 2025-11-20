'use client'
import { useQueryAutomation } from '@/hooks/user-queries'
import React from 'react'
import ActiveTrigger from './active'
import ThenAction from '../then/then-action'
import TriggerButton from '../trigger-button'
import { AUTOMATION_TRIGGERS } from '@/constants/automation'
import { useTriggers } from '@/hooks/use-automations'
import { cn } from '@/lib/utils'
import Keywords from './keywords'
import { AlertCircle } from 'lucide-react'

type Props = {
  id: string
}

const Trigger = ({ id }: Props) => {
  const { type, onSetTrigger, isPending } = useTriggers(id)
  const { data } = useQueryAutomation(id)

  if (data?.data && data?.data?.triggerType) {
    return (
      <div className="flex flex-col ga-y-6 items-center w-full">
        <ActiveTrigger
          type={data.data.triggerType}
          keywords={data.data.keywords}
        />

        {!data.data.listener && <ThenAction id={id} />}
      </div>
    )
  }
  return (
    <>
      <TriggerButton label="Set Up Automation Trigger">
        <div className="flex flex-col gap-y-5">
          {/* Instruction text */}
          <div className="bg-blue-500/10 p-3 rounded-lg text-sm flex items-start gap-x-2">
            <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-gray-300">
              Choose what will trigger your automation: <strong>Comments</strong> - when users comment on your posts with specific keywords, or <strong>DMs</strong> - when users send you direct messages containing specific keywords.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AUTOMATION_TRIGGERS.map((trigger) => (
              <div
                key={trigger.id}
                onClick={() => onSetTrigger(trigger.type)}
                className={cn(
                  'transition-all duration-200 text-white rounded-xl flex cursor-pointer flex-col p-4 gap-y-2',
                  type !== trigger.type
                    ? 'bg-slate-800 hover:bg-slate-700'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/10'
                )}
              >
                <div className="flex gap-x-2 items-center">
                  {trigger.icon}
                  <p className="font-medium">{trigger.label}</p>
                </div>
                <p className="text-sm text-gray-300">{trigger.description}</p>
              </div>
            ))}
          </div>
          
          <Keywords id={id} />
        </div>
      </TriggerButton>
    </>
  )
}

export default Trigger

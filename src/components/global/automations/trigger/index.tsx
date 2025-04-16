'use client'
import { useQueryAutomation } from '@/hooks/user-queries'
import React from 'react'
import ActiveTrigger from './active'
import { Separator } from '@/components/ui/separator'
import ThenAction from '../then/then-action'
import TriggerButton from '../trigger-button'
import { AUTOMATION_TRIGGERS } from '@/constants/automation'
import { useTriggers } from '@/hooks/use-automations'
import { cn } from '@/lib/utils'
import Keywords from './keywords'
import { Button } from '@/components/ui/button'
import Loader from '../../loader'
import { AlertCircle, CheckCircle } from 'lucide-react'
import SuccessIndicator from '../success-indicator'

type Props = {
  id: string
}

const Trigger = ({ id }: Props) => {
  const { types, onSetTrigger, onSaveTrigger, isPending, success } = useTriggers(id)
  const { data } = useQueryAutomation(id)

  if (data?.data && data?.data?.trigger.length > 0) {
    return (
      <div className="flex flex-col ga-y-6 items-center w-full">
        <ActiveTrigger
          type={data.data.trigger[0].type}
          keywords={data.data.keywords}
        />

        {data?.data?.trigger.length > 1 && (
          <>
            <div className="relative w-full my-4">
              <p className="absolute transform px-4 bg-slate-800 -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2 font-medium text-blue-400">
                OR
              </p>
              <Separator
                orientation="horizontal"
                className="border-slate-700 border-[1px]"
              />
            </div>
            <ActiveTrigger
              type={data.data.trigger[1].type}
              keywords={data.data.keywords}
            />
          </>
        )}

        {!data.data.listener && <ThenAction id={id} />}
      </div>
    )
  }
  return (
    <>
      <SuccessIndicator showSuccess={success} />
      
      <TriggerButton label="Set Up Automation Trigger">
        <div className="flex flex-col gap-y-5">
          {/* Instruction text */}
          <div className="bg-blue-500/10 p-3 rounded-lg text-sm flex items-start gap-x-2">
            <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-gray-300">
              Select what should trigger your automation. You can monitor comments on your posts 
              or direct messages containing specific keywords.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AUTOMATION_TRIGGERS.map((trigger) => (
              <div
                key={trigger.id}
                onClick={() => onSetTrigger(trigger.type)}
                className={cn(
                  'transition-all duration-200 text-white rounded-xl flex cursor-pointer flex-col p-4 gap-y-2',
                  !types?.find((t) => t === trigger.type)
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
          
          <Button
            onClick={onSaveTrigger}
            disabled={types?.length === 0}
            className={cn(
              "w-full transition-all duration-200 mt-4 flex items-center justify-center gap-2",
              types?.length > 0 
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium" 
                : "bg-slate-700 text-slate-300"
            )}
          >
            {isPending ? (
              <Loader />
            ) : (
              <>
                <span>{types?.length === 0 ? "Select a Trigger Type" : "Create Trigger"}</span>
                {success && <CheckCircle size={16} className="text-green-200" />}
              </>
            )}
          </Button>
        </div>
      </TriggerButton>
    </>
  )
}

export default Trigger

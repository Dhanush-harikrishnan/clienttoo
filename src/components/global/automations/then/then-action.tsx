'use client'
import { useListener } from '@/hooks/use-automations'
import React from 'react'
import TriggerButton from '../trigger-button'
import { AUTOMATION_LISTENERS } from '@/constants/automation'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Loader from '../../loader'
import SuccessIndicator from '../success-indicator'
import { CheckCircle } from 'lucide-react'

type Props = {
  id: string
}

const ThenAction = ({ id }: Props) => {
  const {
    onSetListener,
    listener: Listener,
    onFormSubmit,
    register,
    isPending,
    success
  } = useListener(id)

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onFormSubmit(e)
  }

  return (
    <>
      <SuccessIndicator showSuccess={success} />
      
      <TriggerButton label="Then">
        <div className="flex flex-col gap-y-2 ">
          {AUTOMATION_LISTENERS.map((listener) => (
            <div
              onClick={() => onSetListener(listener.type)}
              key={listener.id}
              className={cn(
                Listener === listener.type
                  ? 'bg-gradient-to-br from-[#3352CC] to-[#1C2D70]'
                  : 'bg-background-80',
                'p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100'
              )}
            >
              <div className="flex gap-x-2 items-center">
                {listener.icon}
                <p>{listener.label}</p>
              </div>
              <p className="text-sm text-gray-400">{listener.description}</p>
            </div>
          ))}
          
          {/* Form appears when a listener is selected */}
          {Listener && (
            <form
              className="p-3 bg-background-90 rounded-xl mt-3 flex flex-col gap-y-5"
              onSubmit={handleFormSubmit}
            >
              {/* Hidden input for reply field */}
              <input 
                type="hidden" 
                {...register('reply')} 
                defaultValue="" 
                value=""
              />
              
              {Listener === 'MESSAGE' ? (
                <div className="flex flex-col gap-y-1">
                  <label className="text-sm text-muted-foreground">
                    Auto-reply message
                  </label>
                  <Textarea
                    className="h-32 bg-background-100 placeholder:text-gray-500 placeholder:italic"
                    {...register('prompt')}
                    placeholder="e.g. Hey, thanks for your message! We'll get back to you soon."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This message will be sent automatically when the trigger fires.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-y-1">
                  <label className="text-sm text-muted-foreground">
                    AI prompt instructions
                  </label>
                  <Textarea
                    className="h-32 bg-background-100 placeholder:text-gray-500 placeholder:italic"
                    {...register('prompt')}
                    placeholder="e.g. Answer like a friendly customer support agent. Keep responses under 3 sentences."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Describe how the AI should respond. Be specific for best results.
                  </p>
                </div>
              )}
              <Button 
                type="submit" 
                disabled={isPending}
                className="flex items-center gap-2"
              >
                {isPending ? <Loader state={true}><span>Saving...</span></Loader> : (
                  <>
                    <span>Save Response</span>
                    {success && <CheckCircle size={16} className="text-green-400" />}
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </TriggerButton>
    </>
  )
}

export default ThenAction

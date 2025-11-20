'use client'
import { useListener } from '@/hooks/use-automations'
import React from 'react'
import TriggerButton from '../trigger-button'
import { AUTOMATION_LISTENERS } from '@/constants/automation'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
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

  // Create a wrapper for the form submission to add debugging
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting form with listener type:", Listener);
    onFormSubmit(e);
  };

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
              <p>{listener.description}</p>
            </div>
          ))}
          
          {/* Form appears when a listener is selected */}
          {Listener && (
            <form
              className="p-3 bg-background-90 rounded-xl mt-3 flex flex-col gap-y-5"
              onSubmit={handleFormSubmit}
            >
              {/* Hidden input for reply field that explicitly has an empty string value */}
              <input 
                type="hidden" 
                {...register('reply')} 
                defaultValue="" 
                value=""
              />
              
              {Listener === 'MESSAGE' ? (
                <div className="flex flex-col gap-y-1">
                  <label className="text-sm text-muted-foreground">Message</label>
                  <Textarea
                    className="h-32 bg-background-100"
                    {...register('prompt')}
                    placeholder="Hey, thanks for your message!"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-y-1">
                  <label className="text-sm text-muted-foreground">
                    AI prompt
                  </label>
                  <Textarea
                    className="h-32 bg-background-100"
                    {...register('prompt')}
                    placeholder="Answer like a customer support agent"
                  />
                </div>
              )}
              <Button 
                type="submit" 
                disabled={isPending}
                className="flex items-center gap-2"
              >
                {isPending ? <Loader state={true}><span>Loading...</span></Loader> : (
                  <>
                    <span>Save</span>
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

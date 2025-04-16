import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
  trigger: JSX.Element
  children: React.ReactNode
  className?: string
}

const PopOver = ({ children, trigger, className }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className={cn(
          'bg-gradient-to-br from-slate-800 to-slate-900 p-4 border border-slate-700/50 shadow-xl rounded-xl max-h-[80vh] overflow-y-auto', 
          className
        )}
        align="center"
        side="bottom"
        sideOffset={12}
        alignOffset={0}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}

export default PopOver

import React from 'react'
import PopOver from '../../popover'
import { PlusCircle } from 'lucide-react'

type Props = {
  children: React.ReactNode
  label: string
}

const TriggerButton = ({ children, label }: Props) => {
  return (
    <PopOver
      className="w-[500px]"
      trigger={
        <div className="border-2 border-dashed w-full border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10 cursor-pointer transition-all duration-200 rounded-xl flex gap-x-2 justify-center items-center p-5 mt-4">
          <PlusCircle className="text-blue-400" size={20} />
          <p className="text-blue-400 font-medium">{label}</p>
        </div>
      }
    >
      {children}
    </PopOver>
  )
}

export default TriggerButton

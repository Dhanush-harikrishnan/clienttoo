import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import React from 'react'

type Props = {
  label: string
  subLabel: string
  description: string
}

const DoubleGradientCard = ({ description, label, subLabel }: Props) => {
  return (
    <div className="group relative border border-slate-700/30 p-6 rounded-xl flex flex-col gap-y-16 overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
      <div className="flex flex-col z-10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{label}</h2>
        <p className="text-gray-400 text-sm">{subLabel}</p>
      </div>
      <div className="flex justify-between items-center z-10 gap-x-10">
        <p className="text-gray-300 text-sm">{description}</p>
        <Button className="rounded-full bg-blue-500 hover:bg-blue-600 w-10 h-10 transition-transform duration-300 group-hover:scale-110">
          <ArrowRight className="text-white" />
        </Button>
      </div>
      
      {/* Modern gradient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
    </div>
  )
}

export default DoubleGradientCard

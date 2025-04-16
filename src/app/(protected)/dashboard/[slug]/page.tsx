import DoubleGradientCard from '@/components/global/double-gradient-card'
import { DASHBOARD_CARDS } from '@/constants/dashboard'
import { BarDuoToneBlue } from '@/icons'
import React from 'react'
import Chart from './_components/metrics'
import MetricsCard from './_components/metrics/metrics-card'

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="flex flex-col gap-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {DASHBOARD_CARDS.map((card) => (
          <DoubleGradientCard
            key={card.id}
            {...card}
          />
        ))}
      </div>
      
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 p-6 rounded-xl shadow-lg backdrop-blur-sm">
        <div className="flex gap-x-3 items-center mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <BarDuoToneBlue />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Automated Activity
            </h2>
            <p className="text-gray-400 text-sm">
              Automated 0 out of 1 interactions
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/20">
            <Chart />
          </div>
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/20">
            <MetricsCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page

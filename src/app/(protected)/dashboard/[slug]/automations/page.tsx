import AutomationList from '@/components/global/automation-list'
import CreateAutomation from '@/components/global/create-automation'
import AutomationsSidebar from '@/components/global/automations-sidebar'
import React from 'react'

type Props = {}

const Page = (props: Props) => {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
      <div className="lg:col-span-4">
        <AutomationList />
      </div>
      <div className="lg:col-span-2">
        <AutomationsSidebar />
      </div>
    </div>
  )
}

export default Page

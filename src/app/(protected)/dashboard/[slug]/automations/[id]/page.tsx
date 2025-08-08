import { getAutomationInfo } from '@/actions/automations'
import PostNode from '@/components/global/automations/post/node'
import ThenNode from '@/components/global/automations/then/node'
import Trigger from '@/components/global/automations/trigger'
import AutomationsBreadCrumb from '@/components/global/bread-crumbs/automations'
import { Warning } from '@/icons'
import { PrefetchUserAutomation } from '@/react-query/prefetch'
import { ArrowDownCircle, CheckCircle, InfoIcon } from 'lucide-react'

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

import React from 'react'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const info = await getAutomationInfo(params.id)
  return {
    title: info.data?.name || 'Automation Setup',
  }
}

const Page = async ({ params }: Props) => {
  const query = new QueryClient()
  await PrefetchUserAutomation(query, params.id)
  const automationInfo = await getAutomationInfo(params.id)
  
  // Check what step of the automation we're at with proper validation
  const hasTrigger = (automationInfo?.data?.trigger?.length ?? 0) > 0
  const hasListener = automationInfo?.data?.listener !== null && automationInfo?.data?.listener !== undefined
  const hasPosts = (automationInfo?.data?.posts?.length ?? 0) > 0
  const hasKeywords = (automationInfo?.data?.keywords?.length ?? 0) > 0

  const isCommentTrigger = automationInfo?.data?.trigger?.some(t => t.type === 'COMMENT') ?? false;
  const allStepsCompleted = hasTrigger && hasListener && (isCommentTrigger ? hasPosts : true);

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex flex-col items-center gap-y-8 py-6">
        <AutomationsBreadCrumb id={params.id} />
        
        {/* Progress indicator */}
        <div className="flex items-center w-full lg:w-10/12 xl:w-6/12 px-4 mb-2">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full ${hasTrigger ? 'bg-green-500 text-white' : 'bg-blue-500/20 text-blue-400'} flex items-center justify-center mb-1`}>
              {hasTrigger ? <CheckCircle size={16} /> : '1'}
            </div>
            <span className={`text-xs ${hasTrigger ? 'text-green-500' : 'text-blue-400'}`}>Trigger</span>
          </div>
          <div className={`h-0.5 flex-1 mx-2 ${hasListener ? 'bg-green-500' : 'bg-slate-700'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full ${hasListener ? 'bg-green-500 text-white' : hasTrigger ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-slate-500'} flex items-center justify-center mb-1`}>
              {hasListener ? <CheckCircle size={16} /> : '2'}
            </div>
            <span className={`text-xs ${hasListener ? 'text-green-500' : hasTrigger ? 'text-blue-400' : 'text-slate-500'}`}>Response</span>
          </div>
          {isCommentTrigger && (
            <>
              <div className={`h-0.5 flex-1 mx-2 ${hasPosts ? 'bg-green-500' : 'bg-slate-700'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${hasPosts ? 'bg-green-500 text-white' : hasListener ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-slate-500'} flex items-center justify-center mb-1`}>
                  {hasPosts ? <CheckCircle size={16} /> : '3'}
                </div>
                <span className={`text-xs ${hasPosts ? 'text-green-500' : hasListener ? 'text-blue-400' : 'text-slate-500'}`}>Posts</span>
              </div>
            </>
          )}
        </div>
        
        {/* Automation setup guide */}
        {!allStepsCompleted && (
          <div className="w-full lg:w-10/12 xl:w-6/12 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4 flex items-start gap-3">
            <InfoIcon className="text-blue-400 mt-1 flex-shrink-0" size={18} />
            <div>
              <h3 className="text-blue-300 font-medium mb-1">Complete your automation setup</h3>
              <p className="text-gray-300 text-sm">
                {!hasTrigger ? "Start by setting up a trigger - what will activate your automation" : 
                 !hasListener ? "Now define how your automation should respond" :
                 isCommentTrigger && !hasPosts ? "Finally, select which posts should be monitored" : ""}
              </p>
            </div>
          </div>
        )}
        
        {/* Always show trigger section first */}
        <div className="w-full lg:w-10/12 xl:w-6/12 relative"> 
          <div className="p-5 rounded-xl flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 gap-y-3 border border-slate-700/30 shadow-lg">
            <div className="flex gap-x-2 items-center mb-2">
              <Warning />
              <h3 className="font-medium text-lg">When this happens...</h3>
            </div>
            <Trigger id={params.id} />
          </div>
        </div>
        
        {/* Show flow arrow and next section only when trigger is completed */}
        {hasTrigger && (
          <>
            <div className="flex flex-col items-center gap-y-2">
              <ArrowDownCircle className="text-blue-400 animate-bounce" size={24} />
              <p className="text-gray-400 text-sm">Then</p>
            </div>
            
            {/* Action node (ThenNode) */}
            <ThenNode id={params.id} />
          </>
        )}
        
        {/* Show posts section only when listener is completed and trigger is 'COMMENT' */}
        {hasTrigger && isCommentTrigger && (
          <>
            <div className="flex flex-col items-center gap-y-2">
              <ArrowDownCircle className="text-blue-400 animate-bounce" size={24} />
              <p className="text-gray-400 text-sm">For</p>
            </div>
            
            {/* Posts node */}
            <PostNode id={params.id} />
          </>
        )}
      </div>
    </HydrationBoundary>
  )
}

export default Page

'use client'
import { Separator } from '@/components/ui/separator'
import { useQueryAutomation } from '@/hooks/user-queries'
import { PlaneBlue, GeminiAi, Warning } from '@/icons'
import React from 'react'
import PostButton from '../post'

type Props = {
  id: string
}

const ThenNode = ({ id }: Props) => {
  const { data } = useQueryAutomation(id)
  // Check for both COMMENT and DM triggers
  const hasTriggers = data?.data?.trigger && data.data.trigger.length > 0

  return !data?.data?.listener ? (
    <></>
  ) : (
    <div className="w-full lg:w-10/12 relative xl:w-6/12 p-5 rounded-xl flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 gap-y-3 border border-slate-700/30 shadow-lg">
      <div className="absolute h-20 left-1/2 bottom-full flex flex-col items-center z-50">
        <span className="h-[9px] w-[9px] bg-blue-400/30 rounded-full" />
        <Separator
          orientation="vertical"
          className="bottom-full flex-1 border-[1px] border-blue-400/30"
        />
        <span className="h-[9px] w-[9px] bg-blue-400/30 rounded-full" />
      </div>
      <div className="flex gap-x-2 items-center mb-2">
        <Warning />
        <h3 className="font-medium text-lg">Response Action</h3>
      </div>
      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
        <div className="flex gap-x-2 items-center mb-2">
          {data.data.listener.listener === 'MESSAGE' ? (
            <PlaneBlue />
          ) : (
            <GeminiAi />
          )}
          <p className="text-lg font-medium text-blue-100">
            {data.data.listener.listener === 'MESSAGE'
              ? 'Send the user a message'
              : 'Use Gemini AI for responses'}
          </p>
        </div>
        <p className="text-gray-300 text-sm border-l-2 border-blue-500/30 pl-3 my-2">
          {data.data.listener.prompt}
        </p>
      </div>
      
      {/* Show post button if there are no posts yet but there are triggers */}
      {data.data.posts.length === 0 && hasTriggers && (
        <div className="mt-4">
          <PostButton id={id} />
        </div>
      )}
    </div>
  )
}

export default ThenNode

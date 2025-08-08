import { InstagramBlue, PlaneBlue } from '@/icons'
import { InstagramIcon, MessageCircleIcon, Hash } from 'lucide-react'
import React from 'react'

type Props = {
  type: string
  keywords: {
    id: string
    word: string
    automationId: string | null
  }[]
}

const ActiveTrigger = ({ keywords, type }: Props) => {
  return (
    <div className="bg-slate-800/50 p-4 rounded-xl w-full border border-slate-700/50">
      {/* Trigger type section */}
      <div className="flex gap-x-3 items-center mb-3">
        {type === 'COMMENT' ? (
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <InstagramIcon className="text-blue-400" size={18} />
          </div>
        ) : (
          <div className="bg-indigo-500/10 p-2 rounded-lg">
            <MessageCircleIcon className="text-indigo-400" size={18} />
          </div>
        )}
        <div>
          <h3 className="text-lg font-medium text-gray-100">
            {type === 'COMMENT'
              ? 'User comments on my post'
              : 'User sends me a dm with a keyword'}
          </h3>
          <p className="text-sm text-gray-400">
            {type === 'COMMENT'
              ? 'Automatically responds when users comment on your selected posts with specified keywords'
              : 'Automatically responds when users send you direct messages containing specified keywords'}
          </p>
        </div>
      </div>
      
      {/* Keywords section */}
      <div className="mt-4 border-t border-slate-700/50 pt-3">
        <div className="flex items-center gap-x-2 mb-2">
          <Hash className="text-blue-400" size={14} />
          <p className="text-sm text-gray-300">Trigger Keywords</p>
        </div>
        
        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((word) => (
              <div
                key={word.id}
                className="bg-blue-500/10 flex items-center gap-x-2 capitalize text-blue-300 py-1 px-3 rounded-full border border-blue-500/20"
              >
                <p>{word.word}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic py-1">
            No keywords defined. Your automation will trigger for all comments/messages.
          </p>
        )}
      </div>
    </div>
  )
}

export default ActiveTrigger

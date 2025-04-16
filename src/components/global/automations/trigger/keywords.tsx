import { Input } from '@/components/ui/input'
import { useKeywords } from '@/hooks/use-automations'
import { useMutationDataState } from '@/hooks/use-mutation-data'
import { useQueryAutomation } from '@/hooks/user-queries'
import { Hash, PlusCircle, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  id: string
}

export const Keywords = ({ id }: Props) => {
  const { onValueChange, keyword, onKeyPress, deleteMutation } = useKeywords(id)
  const { latestVariable } = useMutationDataState(['add-keyword'])
  const { data } = useQueryAutomation(id)
  const [isAdding, setIsAdding] = useState(false)

  // Handle manual submission when the input loses focus
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (keyword.trim().length > 0) {
      const enterEvent = {
        key: 'Enter',
        preventDefault: () => {}
      } as React.KeyboardEvent<HTMLInputElement>;
      onKeyPress(enterEvent);
    }
    setIsAdding(false);
  }

  // Handle Enter key press  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyPress(e);
    if (e.key === 'Enter' && keyword.trim().length > 0) {
      // If keyword was accepted, clear and keep focus
      setTimeout(() => {
        setIsAdding(true);
      }, 100);
    }
  }

  return (
    <div className="bg-slate-800/70 flex flex-col gap-y-4 p-4 rounded-xl border border-slate-700/50 mt-6 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Hash className="text-blue-400" size={16} />
          <p className="text-sm text-gray-300 font-medium">
            Keywords that will trigger this automation
          </p>
        </div>
        {!isAdding && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsAdding(true)}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          >
            <PlusCircle size={16} className="mr-1" />
            Add Keyword
          </Button>
        )}
      </div>
      
      {/* Keyword list */}
      <div className="flex flex-wrap justify-start gap-2 items-center min-h-[40px]">
        {data?.data?.keywords &&
          data?.data?.keywords.length > 0 &&
          data?.data?.keywords.map(
            (word) =>
              word.id !== latestVariable?.variables?.id && (
                <div
                  className="bg-blue-500/10 flex items-center gap-x-2 capitalize text-blue-300 py-1.5 px-3 rounded-full border border-blue-500/20 group hover:bg-blue-500/20 transition-colors"
                  key={word.id}
                >
                  <p>{word.word}</p>
                  <button 
                    onClick={() => deleteMutation({ id: word.id })}
                    className="text-blue-300/50 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
          )}
        {latestVariable && latestVariable.status === 'pending' && (
          <div className="bg-blue-500/10 animate-pulse flex items-center gap-x-2 capitalize text-blue-300 py-1.5 px-3 rounded-full border border-blue-500/20">
            {latestVariable.variables.keyword}
          </div>
        )}
      </div>
      
      {/* Input field section */}
      {(isAdding || data?.data?.keywords?.length === 0) && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-blue-500/30 transition-colors px-3 py-2">
              <Input
                placeholder="Type keyword + press Enter"
                value={keyword}
                className="p-0 text-sm bg-transparent ring-0 border-none outline-none w-full"
                onChange={onValueChange}
                onKeyUp={handleKeyPress}
                onBlur={handleBlur}
                autoFocus
              />
            </div>
            <Button 
              size="sm"
              disabled={!keyword.trim()}
              onClick={() => {
                const enterEvent = {
                  key: 'Enter',
                  preventDefault: () => {}
                } as React.KeyboardEvent<HTMLInputElement>;
                onKeyPress(enterEvent);
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Add
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-1">
            Examples: product info, pricing, availability, etc.
          </p>
        </div>
      )}
    </div>
  )
}
export default Keywords

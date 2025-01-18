import { Input } from '@/components/ui/input'
import { useKeywords } from '@/hooks/use-automations'
import { useMutationDataState } from '@/hooks/use-mutation-data'
import { useQueryAutomation } from '@/hooks/user-queries'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

type Props = {
  id: string
}

export const Keywords = ({ id }: Props) => {
  const { onValueChange, keyword, onKeyPress, deleteMutation } = useKeywords(id)
  const { latestVariable } = useMutationDataState(['add-keyword'])
  const { data } = useQueryAutomation(id)
  const [error, setError] = useState('')

  const handleKeywordSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (keyword.trim().length < 2) {
        setError('Keyword must be at least 2 characters')
        return
      }
      if (data?.data?.keywords?.some(k => k.word.toLowerCase() === keyword.toLowerCase())) {
        setError('Keyword already exists')
        return
      }
      setError('')
      onKeyPress(e)
    }
  }

  const handleDelete = (wordId: string) => {
    deleteMutation({ id: wordId })
  }

  return (
    <div className="bg-background-80 flex flex-col gap-y-3 p-3 rounded-xl">
      <div className="flex justify-between items-center">
        <p className="text-sm text-text-secondary">
          Add words that trigger automations
        </p>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
      <div className="flex flex-wrap justify-start gap-2 items-center">
        {data?.data?.keywords &&
          data?.data?.keywords.length > 0 &&
          data?.data?.keywords.map(
            (word) =>
              word.id !== latestVariable.variables.id && (
                <div
                  className="bg-background-90 flex items-center gap-x-2 capitalize text-text-secondary py-1 px-4 rounded-full group"
                  key={word.id}
                >
                  <p>{word.word}</p>
                  <button
                    onClick={() => handleDelete(word.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              )
          )}
        {latestVariable && latestVariable.status === 'pending' && (
          <div className="bg-background-90 flex items-center gap-x-2 capitalize text-text-secondary py-1 px-4 rounded-full">
            {latestVariable.variables.keyword}
          </div>
        )}
        <Input
          placeholder="Add keyword..."
          style={{
            width: Math.min(Math.max(keyword.length || 10, 2), 50) + 'ch',
          }}
          value={keyword}
          className="p-0 bg-transparent ring-0 border-none outline-none"
          onChange={(e) => {
            setError('')
            onValueChange(e)
          }}
          onKeyUp={handleKeywordSubmit}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Press Enter to add a keyword. Keywords must be at least 2 characters long.
      </p>
    </div>
  )
}

export default Keywords

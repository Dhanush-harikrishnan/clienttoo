'use client'
import { Input } from '@/components/ui/input'
import { SearchIcon, X } from 'lucide-react'
import React, { useState, useCallback } from 'react'
import { useQueryAutomations } from '@/hooks/user-queries'
import { usePaths } from '@/hooks/user-nav'
import Link from 'next/link'
import { cn, getMonth } from '@/lib/utils'

type Props = {}

const Search = (props: Props) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const { data } = useQueryAutomations()
  const { pathname } = usePaths()

  const filteredAutomations = useCallback(() => {
    if (!query.trim() || !data?.data || data.status !== 200) return []
    const q = query.toLowerCase()
    return data.data.filter((a: any) => {
      const nameMatch = a.name?.toLowerCase().includes(q)
      const keywordMatch = a.keywords?.some((k: any) =>
        k.word?.toLowerCase().includes(q)
      )
      return nameMatch || keywordMatch
    }).slice(0, 6)
  }, [query, data])

  const results = filteredAutomations()

  return (
    <div className="relative flex-1">
      <div className={cn(
        "flex overflow-hidden gap-x-2 border-[1px] rounded-full px-4 py-1 items-center flex-1 transition-colors",
        isFocused ? 'border-[#3352CC] bg-slate-800/50' : 'border-[#3352CC]/50'
      )}>
        <SearchIcon color="#3352CC" size={18} />
        <Input
          placeholder="Search automations..."
          className="border-none outline-none ring-0 focus:ring-0 flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-white transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {isFocused && query.trim().length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-[#1D1D1D] border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden max-h-[300px] overflow-y-auto">
          {results.length > 0 ? (
            results.map((automation: any) => (
              <Link
                key={automation.id}
                href={`${pathname}/${automation.id}`}
                className="flex items-center justify-between p-3 hover:bg-slate-800 transition-colors border-b border-slate-700/50 last:border-b-0"
              >
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-white">{automation.name}</p>
                  {automation.keywords?.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Keywords: {automation.keywords.map((k: any) => k.word).join(', ')}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {automation.createdAt &&
                    `${getMonth(new Date(automation.createdAt).getUTCMonth() + 1)} ${new Date(automation.createdAt).getUTCDate()}`}
                </p>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-400">
              No automations found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search

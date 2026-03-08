'use client'
import { usePaths } from '@/hooks/user-nav'
import { cn, getMonth } from '@/lib/utils'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import GradientButton from '../gradient-button'
import { Button } from '@/components/ui/button'
import { useQueryAutomations } from '@/hooks/user-queries'
import CreateAutomation from '../create-automation'
import { useMutationDataState } from '@/hooks/use-mutation-data'
import { useDeleteAutomation } from '@/hooks/use-automations'
import { Trash2 } from 'lucide-react'

type Props = {}

const AutomationList = (props: Props) => {
  const { data } = useQueryAutomations()

  const { latestVariable } = useMutationDataState(['create-automation'])
  const { pathname } = usePaths()
  
  const optimisticUiData = useMemo(() => {
    if ((latestVariable && latestVariable?.variables &&  data)) {
      const test = [latestVariable.variables, ...data.data]
      return { data: test }
    }
    return data || { data: [] }
  }, [latestVariable, data])

  if (data?.status !== 200 || data.data.length <= 0) {
    return (
      <div className="h-[70vh] flex justify-center items-center flex-col gap-y-3">
        <h3 className="text-lg text-gray-400">No Automations </h3>
        <CreateAutomation />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-3">
      {optimisticUiData.data!.map((automation) => (
        <AutomationCard
          key={automation.id}
          automation={automation}
          pathname={pathname}
        />
      ))}
    </div>
  )
}

const AutomationCard = ({
  automation,
  pathname,
}: {
  automation: any
  pathname: string
}) => {
  const { isPending, mutate } = useDeleteAutomation(automation.id)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirmDelete) {
      mutate()
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
      // Auto-dismiss confirmation after 3s
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <div className="relative group">
      <Link
        href={`${pathname}/${automation.id}`}
        className="bg-[#1D1D1D] hover:opacity-80 transition duration-100 rounded-xl p-5 border-[1px] radial--gradient--automations flex border-[#545454]"
      >
        <div className="flex flex-col flex-1 items-start">
          <h2 className="text-xl font-semibold">{automation.name}</h2>
          <p className="text-[#9B9CA0] text-sm font-light mb-2">
            This is from the comment
          </p>

          {automation.keywords && automation.keywords.length > 0 ? (
            <div className="flex gap-x-2 flex-wrap mt-3">
              {automation.keywords.map((keyword: any, idx: number) => (
                <div
                  key={keyword.id}
                  className={cn(
                    'rounded-full px-4 py-1 capitalize',
                    idx % 4 === 0 &&
                      'bg-keyword-green/15 border-2 border-keyword-green',
                    idx % 4 === 1 &&
                      'bg-keyword-purple/15 border-2 border-keyword-purple',
                    idx % 4 === 2 &&
                      'bg-keyword-yellow/15 border-2 border-keyword-yellow',
                    idx % 4 === 3 &&
                      'bg-keyword-red/15 border-2 border-keyword-red'
                  )}
                >
                  {keyword.word}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-full border-2 mt-3 border-dashed border-white/60 px-3 py-1">
              <p className="text-sm text-[#bfc0c3]">No Keywords</p>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between items-end">
          <p className="capitalize text-sm font-light text-[#9B9CA0]">
            {automation.createdAt &&
              `${getMonth(new Date(automation.createdAt).getUTCMonth() + 1)} ${new Date(automation.createdAt).getUTCDate()}th ${new Date(automation.createdAt).getUTCFullYear()}`}
          </p>

          {automation.listener?.listener === 'GEMINI' ? (
            <p className="text-muted-foreground text-right">
              <span className="text-gradient"> Gemini AI </span>
              {automation.listener?.prompt}
            </p>
          ) : (
            <Button className="bg-background-80 hover:bg-background-80 text-white">
              Standard
            </Button>
          )}
        </div>
      </Link>

      {/* Delete button - visible on hover */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className={cn(
          'absolute top-3 right-3 z-10 p-2 rounded-lg transition-all duration-200',
          confirmDelete
            ? 'bg-red-500/90 text-white opacity-100 scale-100'
            : 'bg-slate-800/80 text-gray-400 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100',
          isPending && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isPending ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : confirmDelete ? (
          <span className="text-xs font-medium px-1">Confirm?</span>
        ) : (
          <Trash2 size={16} />
        )}
      </button>
    </div>
  )
}

export default AutomationList

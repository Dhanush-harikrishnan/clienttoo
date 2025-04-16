import { PAGE_ICON } from '@/constants/pages'
import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
  page: string
  slug?: string
  className?: string
}

const MainBreadCrumb = ({ page, slug, className }: Props) => {
  return (
    <div className={cn("flex flex-col items-start w-full", className)}>
      {page === 'Home' && (
        <div className="flex justify-center w-full mb-4">
          <div className="flex flex-col items-center">
            <p className="text-gray-400 text-lg">Welcome back</p>
            <h2 className="capitalize text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{slug}!</h2>
          </div>
        </div>
      )}
      {page !== 'Home' && (
        <div className="flex items-center gap-3 py-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            {PAGE_ICON[page.toUpperCase()]}
          </div>
          <h2 className="font-bold text-2xl capitalize bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{page}</h2>
        </div>
      )}
    </div>
  )
}

export default MainBreadCrumb

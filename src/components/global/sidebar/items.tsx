import { SIDEBAR_MENU } from '@/constants/menu'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
  page: string
  slug: string
}

const Items = ({ page, slug }: Props) => {
  return SIDEBAR_MENU.map((item) => (
    <Link
      key={item.id}
      href={`/dashboard/${slug}/${item.label === 'home' ? '/' : item.label}`}
      className={cn(
        'capitalize flex items-center gap-x-3 rounded-lg p-3 transition-all duration-200 font-medium',
        page === item.label || (page === slug && item.label === 'home')
          ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/10 text-white border-l-2 border-blue-400'
          : 'text-gray-400 hover:text-gray-200 hover:bg-blue-500/10'
      )}
    >
      <span className={cn(
        "transition-all duration-200",
        page === item.label || (page === slug && item.label === 'home')
          ? 'text-blue-400'
          : 'text-gray-500 group-hover:text-blue-400'
      )}>
        {item.icon}
      </span>
      {item.label}
    </Link>
  ))
}

export default Items

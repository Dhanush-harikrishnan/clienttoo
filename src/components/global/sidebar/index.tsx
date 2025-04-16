'use client'
import { usePaths } from '@/hooks/user-nav'
import React from 'react'
import Items from './items'
import { Separator } from '@/components/ui/separator'
import ClerkAuthState from '../clerk-auth-state'
import { HelpDuoToneWhite } from '@/icons'

type Props = {
  slug: string
}

const Sidebar = ({ slug }: Props) => {
  const { page } = usePaths()

  return (
    <div
      className="w-[250px] 
    border-[1px]
    radial 
    fixed 
    left-0 
    lg:inline-block
    border-slate-700/50
    bg-gradient-to-b from-blue-900/40 via-slate-900 to-blue-900/40
    hidden 
    bottom-0 
    top-0 
    m-3 
    rounded-3xl 
    overflow-hidden
    shadow-lg shadow-blue-500/10"
    >
      <div
        className="flex flex-col 
      gap-y-5
       w-full 
       h-full 
       p-3 
       bg-slate-900/90
       bg-clip-padding 
       backdrop-filter 
       backdrop-blur-3xl
       relative"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        <div className="flex items-center gap-3 p-5 justify-center relative z-10">
          <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center font-bold text-white">
            CT
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            clienttoo
          </span>
        </div>
        
        <div className="flex flex-col py-3 relative z-10">
          <Items
            page={page}
            slug={slug}
          />
        </div>
        
        <div className="px-16 relative z-10">
          <Separator
            orientation="horizontal"
            className="bg-slate-700/50"
          />
        </div>
        
        <div className="px-3 flex flex-col gap-y-5 relative z-10">
          <div className="flex gap-x-2 items-center p-2 hover:bg-blue-500/10 rounded-lg transition-all duration-200">
            <ClerkAuthState />
            <p className="text-gray-300 hover:text-white transition-colors">Profile</p>
          </div>
          <div className="flex gap-x-3 items-center p-2 hover:bg-blue-500/10 rounded-lg transition-all duration-200">
            <HelpDuoToneWhite />
            <p className="text-gray-300 hover:text-white transition-colors">Help</p>
          </div>
        </div>
        
        {/* Glow effect at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
      </div>
    </div>
  )
}

export default Sidebar


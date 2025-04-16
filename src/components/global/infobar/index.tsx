'use client'

import { PAGE_BREAD_CRUMBS } from '@/constants/pages'
import { usePaths } from '@/hooks/user-nav'
import { Menu } from 'lucide-react'
import React from 'react'
import Sheet from '../sheet'
import Items from '../sidebar/items'
import { Separator } from '@/components/ui/separator'
import ClerkAuthState from '../clerk-auth-state'
import { HelpDuoToneWhite } from '@/icons'
import { LogoSmall } from '@/svgs/logo-small'
import CreateAutomation from '../create-automation'
import Search from './search'
import { Notifications } from './notifications'
import MainBreadCrumb from '../bread-crumbs/main-bread-crumb'

type Props = {
  slug: string
}

const InfoBar = ({ slug }: Props) => {
  const { page } = usePaths()
  const currentPage = PAGE_BREAD_CRUMBS.includes(page) || page == slug

  return (
    currentPage && (
      <div className="flex flex-col">
        <div className="flex gap-x-3 lg:gap-x-5 items-center justify-between mb-4 p-3 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/30 shadow-md">
          <span className="lg:hidden flex items-center gap-x-2">
            <Sheet
              trigger={<Menu className="text-gray-300 hover:text-white transition-colors" />}
              className="lg:hidden"
              side="left"
            >
              <div className="flex flex-col gap-y-5 w-full h-full p-3 bg-slate-900/90 bg-clip-padding backdrop-filter backdrop-blur-3xl relative">
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
              </div>
            </Sheet>
          </span>
          
          {/* Desktop Logo - Only visible on larger screens */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white">
              CT
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              clienttoo
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Search />
            <CreateAutomation />
            <Notifications />
          </div>
        </div>
        <MainBreadCrumb
          page={page === slug ? 'Home' : page}
          slug={slug}
          className="text-gray-300 font-medium bg-slate-900/30 backdrop-blur-sm p-3 rounded-xl border border-slate-700/20 shadow-sm"
        />
      </div>
    )
  )
}

export default InfoBar

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/global/sidebar'
import React from 'react'
import {
  PrefetchUserAutnomations,
  PrefetchUserProfile,
} from '@/react-query/prefetch'

type Props = {
  children: React.ReactNode
  params: { slug: string }
}

const Layout = async ({ children, params }: Props) => {
  const query = new QueryClient()

  await PrefetchUserProfile(query)
  await PrefetchUserAutnomations(query)

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Content area */}
        <div className="relative z-10 p-3">
          <Sidebar slug={params.slug} />
          <div className="
            lg:ml-[270px] 
            lg:pl-6 
            lg:pr-6
            lg:py-6
            flex 
            flex-col 
            gap-6
            overflow-auto
          ">
            <InfoBar slug={params.slug} />
            <div className="bg-slate-900/30 backdrop-blur-sm p-6 rounded-xl border border-slate-700/20 shadow-lg">
              {children}
            </div>
          </div>
        </div>
        
        {/* Glow effects */}
        <div className="pointer-events-none fixed top-0 left-1/3 w-1/3 h-1/3 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="pointer-events-none fixed bottom-0 right-1/4 w-1/3 h-1/3 bg-cyan-500 rounded-full opacity-5 blur-3xl"></div>
      </div>
    </HydrationBoundary>
  )
}

export default Layout

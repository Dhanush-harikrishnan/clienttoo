'use client'
import { Separator } from '@/components/ui/separator'
import { useQueryAutomation } from '@/hooks/user-queries'
import { InstagramBlue, Warning } from '@/icons'
import { InstagramIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
  id: string
}

const PostNode = ({ id }: Props) => {
  const { data } = useQueryAutomation(id)
  
  const hasPostsAndTriggers = 
    data?.data?.posts?.length > 0 && 
    data?.data?.trigger?.length > 0;

  if (!hasPostsAndTriggers) {
    return null;
  }

  return (
    <div className="w-full lg:w-10/12 relative xl:w-6/12 p-5 rounded-xl flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 gap-y-4 border border-blue-500/20 shadow-lg shadow-blue-500/5">
      <div className="absolute h-20 left-1/2 bottom-full flex flex-col items-center z-50">
        <span className="h-[9px] w-[9px] bg-blue-400/30 rounded-full" />
        <Separator
          orientation="vertical"
          className="bottom-full flex-1 border-[1px] border-blue-400/30"
        />
        <span className="h-[9px] w-[9px] bg-blue-400/30 rounded-full" />
      </div>
      <div className="flex gap-x-2 items-center">
        <InstagramIcon className="text-blue-400" size={18} />
        <h3 className="font-medium text-lg text-blue-100">Selected Instagram Posts</h3>
      </div>
      <div className="bg-slate-800/50 p-4 rounded-xl">
        <p className="text-gray-300 mb-3 text-sm">
          Your automation will respond to interactions on these posts:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.data.posts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group"
            >
              <Image
                fill
                sizes="100vw"
                src={post.media}
                alt="Instagram post"
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PostNode

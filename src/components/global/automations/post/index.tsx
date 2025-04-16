import { useAutomationPosts } from '@/hooks/use-automations'
import { useQueryAutomationPosts } from '@/hooks/user-queries'
import React from 'react'
import TriggerButton from '../trigger-button'
import { InstagramPostProps } from '@/types/posts.type'
import { CheckCircle, InstagramIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Loader from '../../loader'
import SuccessIndicator from '../success-indicator'

type Props = {
  id: string
}

const PostButton = ({ id }: Props) => {
  const { data } = useQueryAutomationPosts()
  const { posts, onSelectPost, mutate, isPending, success } = useAutomationPosts(id)

  return (
    <>
      <SuccessIndicator showSuccess={success} />
      
      <TriggerButton label="Attach Instagram Posts">
        <div className="flex flex-col gap-y-6 w-full">
          {/* Instruction text */}
          <div className="bg-blue-500/10 p-3 rounded-lg text-sm flex items-start gap-x-2">
            <InstagramIcon className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-gray-300">
              Select Instagram posts you want to monitor for comments or messages.
              This will allow the automation to respond when users interact with these specific posts.
            </p>
          </div>
          
          {data?.status === 200 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.data.data.map((post: InstagramPostProps) => (
                  <div
                    onClick={() =>
                      onSelectPost({
                        postid: post.id,
                        caption: post.caption,
                        media: post.media_url,
                        mediaType: post.media_type,
                      })
                    }
                    key={post.id}
                    className={cn(
                      'rounded-lg overflow-hidden cursor-pointer border-2 relative group',
                      posts.find((p) => p.postid === post.id)
                        ? 'border-blue-500'
                        : 'border-transparent'
                    )}
                  >
                    <Image
                      alt={post.caption || 'Instagram post'}
                      src={post.media_url}
                      width={400}
                      height={400}
                      className="object-cover aspect-square w-full transition-all duration-200 group-hover:opacity-80"
                    />
                    {posts.find((p) => p.postid === post.id) && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center backdrop-blur-[1px] z-10">
                        <div className="bg-blue-500 rounded-full p-1">
                          <CheckCircle color="white" size={18} />
                        </div>
                      </div>
                    )}
                    {post.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
                        <p className="text-white text-sm line-clamp-2">
                          {post.caption}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => mutate(undefined)}
                disabled={posts.length === 0 || isPending}
                className={cn(
                  'mt-4 transition-all duration-200 flex items-center justify-center gap-2',
                  posts.length > 0
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium'
                    : 'bg-slate-700 text-slate-300'
                )}
              >
                {isPending ? (
                  <Loader />
                ) : (
                  <>
                    <span>{posts.length === 0 ? 'Select Posts to Monitor' : 'Attach Selected Posts'}</span>
                    {success && <CheckCircle size={16} className="text-green-200" />}
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-gray-400 text-sm">No Instagram posts found</p>
              <p className="text-gray-600 text-xs mt-1">
                Connect your Instagram account to use this feature
              </p>
            </div>
          )}
        </div>
      </TriggerButton>
    </>
  )
}

export default PostButton

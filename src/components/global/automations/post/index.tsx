'use client'
import { useAutomationPosts } from '@/hooks/use-automations'
import { useQueryAutomationPosts } from '@/hooks/user-queries'
import React, { useState } from 'react'
import TriggerButton from '../trigger-button'
import { InstagramPostProps } from '@/types/posts.type'
import { CheckCircle, InstagramIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Loader from '../../loader'
import SuccessIndicator from '../success-indicator'
import { Spinner } from '../../loader/spinner'

type Props = {
  id: string
}

const PostCard = ({ post, isSelected, onClick }: { 
  post: InstagramPostProps
  isSelected: boolean
  onClick: () => void
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg overflow-hidden cursor-pointer border-2 relative group bg-slate-800/50',
        isSelected ? 'border-blue-500' : 'border-slate-700 hover:border-slate-600'
      )}
    >
      <div className="relative aspect-square w-full">
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 animate-pulse flex items-center justify-center">
            <InstagramIcon className="w-12 h-12 text-slate-600" />
          </div>
        )}
        
        {/* Error fallback */}
        {imageError && (
          <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center gap-2">
            <svg className="w-16 h-16 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs text-slate-500">Image unavailable</span>
          </div>
        )}
        
        {/* Actual image */}
        {!imageError && (
          <Image
            alt={post.caption || 'Instagram post'}
            src={post.media_url}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={cn(
              'object-cover transition-all duration-300',
              imageLoaded ? 'opacity-100' : 'opacity-0',
              'group-hover:scale-105'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            unoptimized
          />
        )}
      </div>
      
      {isSelected && (
        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center backdrop-blur-[1px] z-10">
          <div className="bg-blue-500 rounded-full p-2 shadow-lg">
            <CheckCircle color="white" size={24} />
          </div>
        </div>
      )}
      
      {post.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8 z-[5]">
          <p className="text-white text-xs line-clamp-2 font-medium">
            {post.caption}
          </p>
        </div>
      )}
    </div>
  )
}

const PostButton = ({ id }: Props) => {
  const { data } = useQueryAutomationPosts()
  const { posts, onSelectPost, mutate, isPending, success } = useAutomationPosts(id)

  const instagramPosts = data?.data?.data || []
  const hasError = data?.status !== 200
  const isLoading = !data
  const errorMessage = data?.data?.message || data?.data?.error?.message

  console.log('PostButton data:', { 
    status: data?.status, 
    hasData: !!data?.data, 
    postsCount: instagramPosts.length,
    errorMessage 
  })

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
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <Spinner />
              <p className="text-gray-400 text-sm mt-3">Loading your Instagram posts...</p>
            </div>
          ) : hasError || instagramPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-gray-400 text-sm">
                {instagramPosts.length === 0 ? 'No Instagram posts found' : 'Unable to load posts'}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                {errorMessage || 'Check your Instagram connection and try again'}
              </p>
              {hasError && (
                <p className="text-gray-500 text-xs mt-2 max-w-md text-center">
                  Status: {data?.status} - Make sure your Instagram Business account is properly connected
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {instagramPosts.map((post: InstagramPostProps) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isSelected={!!posts.find((p) => p.postid === post.id)}
                    onClick={() =>
                      onSelectPost({
                        postid: post.id,
                        caption: post.caption,
                        media: post.media_url,
                        mediaType: post.media_type,
                      })
                    }
                  />
                ))}
              </div>
              
              <Button
                onClick={() => mutate()}
                disabled={posts.length === 0 || isPending}
                className={cn(
                  'mt-4 transition-all duration-200 flex items-center justify-center gap-2',
                  posts.length > 0 && !isPending
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium'
                    : 'bg-slate-700 text-slate-300 cursor-not-allowed'
                )}
              >
                {isPending ? (
                  <Spinner />
                ) : (
                  <>
                    <span>{posts.length === 0 ? 'Select Posts to Monitor' : 'Attach Selected Posts'}</span>
                    {success && <CheckCircle size={16} className="text-green-200" />}
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </TriggerButton>
    </>
  )
}

export default PostButton

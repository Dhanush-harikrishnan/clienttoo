import { z } from 'zod'
import {
  createAutomations,
  deleteKeyword,
  onSaveTrigger,
  saveKeyword,
  saveListener,
  savePosts,
  updateAutomationName,
} from '@/actions/automations'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMutationData } from './use-mutation-data'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import useZodForm from './use-zod-form'
import { toast } from 'sonner'

export const useCreateAutomation = (id?: string) => {
  const { isPending, mutate } = useMutationData(
    ['create-automation'],
    () => createAutomations(id),
    'user-automations'
  )

  return { isPending, mutate }
}

export const useEditAutomation = (automationId: string) => {
  const [edit, setEdit] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const enableEdit = () => setEdit(true)
  const disableEdit = () => setEdit(false)

  const { isPending, mutate } = useMutationData(
    ['update-automation'],
    (data: { name: string }) =>
      updateAutomationName(automationId, { name: data.name }),
    ['automation-info', automationId],
    disableEdit
  )

  useEffect(() => {
    function handleClickOutside(this: Document, event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node | null)
      ) {
        if (inputRef.current.value !== '') {
          mutate({ name: inputRef.current.value })
        } else {
          disableEdit()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return {
    edit,
    enableEdit,
    disableEdit,
    inputRef,
    isPending,
  }
}

export const useListener = (id: string) => {
  const [listener, setListener] = useState<'MESSAGE' | 'GEMINI' | null>(null)
  const [success, setSuccess] = useState(false);

  // Simplified schema with proper optional field
  const promptSchema = z.object({
    prompt: z.string().min(1),
    reply: z.string().optional().default(""),
  })

  const { isPending, mutate } = useMutationData(
    ['create-lister'],
    (data: { prompt: string; reply?: string }) => {
      return saveListener(id, listener || 'MESSAGE', data.prompt, data.reply || "");
    },
    ['automation-info', id],
    () => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  )

  const { errors, onFormSubmit, register, reset, watch } = useZodForm(
    promptSchema,
    mutate,
    { reply: "" } // Provide default values
  )

  const onSetListener = (type: 'GEMINI' | 'MESSAGE') => setListener(type)
  return { onSetListener, register, onFormSubmit, listener, isPending, success }
}

export const useTriggers = (id: string) => {
  const [type, setType] = useState<'COMMENT' | 'DM'>()
  const { isPending, mutate } = useMutationData(
    ['add-trigger'],
    (data: { type: 'COMMENT' | 'DM' }) => onSaveTrigger(id, data.type),
    ['automation-info', id]
  )

  const onSetTrigger = (type: 'COMMENT' | 'DM') => {
    setType(type)
  }

  useEffect(() => {
    if (type) {
      mutate({ type })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  return { onSetTrigger, isPending, type }
}

export const useKeywords = (id: string) => {
  const [keyword, setKeyword] = useState('')
  
  // Improve input handling to trim and sanitize input
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  const { mutate, isPending } = useMutationData(
    ['add-keyword'],
    async (data: { keyword: string }) => {
      // Ensure keyword is not empty before saving
      const trimmedKeyword = data.keyword.trim();
      if (trimmedKeyword.length === 0) {
        throw new Error('Keyword cannot be empty');
      }
      if (trimmedKeyword.length > 50) {
        throw new Error('Keyword too long (max 50 characters)');
      }
      return await saveKeyword(id, trimmedKeyword);
    },
    ['automation-info', id],
    () => {
      setKeyword('');
    }
  )

  // Handle keypress for Enter key
  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword.length > 0) {
        mutate({ keyword: trimmedKeyword });
      }
    }
  }

  // Handle manual add button click
  const onAddKeyword = () => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length > 0) {
      mutate({ keyword: trimmedKeyword });
    }
  }

  const { mutate: deleteMutation } = useMutationData(
    ['delete-keyword'],
    (data: { id: string }) => deleteKeyword(data.id),
    ['automation-info', id]
  )

  return { 
    keyword, 
    onValueChange, 
    onKeyPress, 
    onAddKeyword,
    deleteMutation, 
    isPending 
  }
}

export const useAutomationPosts = (id: string) => {
  const [posts, setPosts] = useState<
    {
      postid: string
      caption?: string
      media: string
      mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'
    }[]
  >([])
  const [success, setSuccess] = useState(false);

  const onSelectPost = (post: {
    postid: string
    caption?: string
    media: string
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'
  }) => {
    setPosts((prevItems) => {
      if (prevItems.find((p) => p.postid === post.postid)) {
        return prevItems.filter((item) => item.postid !== post.postid)
      } else {
        return [...prevItems, post]
      }
    })
  }

  const { mutate, isPending } = useMutationData(
    ['attach-posts'],
    () => savePosts(id, posts),
    ['automation-info', id],
    () => {
      setPosts([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  )
  
  const onAttachPosts = () => {
    if (posts && posts.length > 0) {
      mutate(undefined)
    }
  }
  
  return { posts, onSelectPost, mutate: onAttachPosts, isPending, success }
}

export const useDeleteAutomation = (id: string, options?: { redirectAfter?: boolean }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const shouldRedirect = options?.redirectAfter ?? false

  const { isPending, mutate } = useMutation({
    mutationKey: ['delete-automation', id],
    mutationFn: async () => {
      const { deleteAutomation } = await import('@/actions/automations')
      return deleteAutomation(id)
    },
    onMutate: async () => {
      // Cancel running queries
      await queryClient.cancelQueries({ queryKey: ['user-automations'] })

      // Snapshot current data for rollback
      const previous = queryClient.getQueryData(['user-automations'])

      // Optimistically remove from the list immediately
      queryClient.setQueryData(['user-automations'], (old: any) => {
        if (!old?.data) return old
        return {
          ...old,
          data: old.data.filter((a: any) => a.id !== id),
        }
      })

      return { previous }
    },
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ['automation-info', id] })
      if (shouldRedirect) {
        router.push('/dashboard')
      }
      toast(data?.status === 200 ? 'Success' : 'Error', {
        description: data?.status === 200 ? 'Automation deleted' : 'Failed to delete',
      })
    },
    onError: (_err, _vars, context: any) => {
      // Roll back to previous data on error
      if (context?.previous) {
        queryClient.setQueryData(['user-automations'], context.previous)
      }
      toast('Error', { description: 'Failed to delete automation. Please try again.' })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user-automations'] })
    },
  })

  return {
    isPending,
    mutate,
  }
}

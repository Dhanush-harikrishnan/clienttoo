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

import { useQueryClient } from '@tanstack/react-query'
import { useMutationData } from './use-mutation-data'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import useZodForm from './use-zod-form'

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

  const queryClient = useQueryClient();

  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['automation-info', id] })
    }
  }, [success, queryClient, id])

  // Debug listener changes
  useEffect(() => {
    console.log("Listener type selected:", listener);
  }, [listener]);

  // Simplified schema with proper optional field
  const promptSchema = z.object({
    prompt: z.string().min(1),
    reply: z.string().optional().default(""),
  })

  const { isPending, mutate } = useMutationData(
    ['create-lister'],
    (data: { prompt: string; reply?: string }) => {
      console.log("Mutation data:", data, "Listener type:", listener);
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
  }, [type, mutate])

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

  const queryClient = useQueryClient();

  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['automation-info', id] })
    }
  }, [success, queryClient, id])

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

export const useDeleteAutomation = (id: string) => {
  const router = useRouter()
  const { isPending, mutate } = useMutationData(
    ['delete-automation'],
    () => onSaveTrigger(id, 'DM'),
    ['user-automations'],
    () => {
      router.push('/dashboard')
    }
  )

  return {
    isPending,
    mutate,
  }
}

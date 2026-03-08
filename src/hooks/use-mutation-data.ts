import {
  MutationFunction,
  MutationKey,
  useMutation,
  useMutationState,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

export const useMutationData = (
  mutationKey: MutationKey,
  mutationFn: MutationFunction<any, any>,
  queryKey?: string | string[],
  onSuccess?: () => void
) => {
  const client = useQueryClient()
  const normalizedKey = queryKey
    ? Array.isArray(queryKey)
      ? queryKey
      : [queryKey]
    : undefined

  const { mutate, isPending } = useMutation({
    mutationKey,
    mutationFn,
    onMutate: async () => {
      // Cancel in-flight queries so optimistic data isn't overwritten
      if (normalizedKey) {
        await client.cancelQueries({ queryKey: normalizedKey })
      }
    },
    onSuccess: (data) => {
      if (data?.status === 200 && onSuccess) {
        onSuccess()
      }
      return toast(data?.status === 200 ? 'Success' : 'Error', {
        description: data?.data || 'Operation completed',
      })
    },
    onError: (error) => {
      console.error('Mutation error:', error)
      return toast('Error', {
        description: 'Something went wrong. Please try again.',
      })
    },
    onSettled: async () => {
      // Single invalidation point — refetch fresh data after mutation
      if (normalizedKey) {
        await client.invalidateQueries({ queryKey: normalizedKey })
      }
    },
  })

  return { mutate, isPending }
}

export const useMutationDataState = (mutationKey: MutationKey) => {
  const data = useMutationState({
    filters: { mutationKey },
    select: (mutation) => {
      return {
        variables: mutation.state.variables as any,
        status: mutation.state.status,
      }
    },
  })

  const latestVariable = data[data.length - 1]
  return { latestVariable }
}

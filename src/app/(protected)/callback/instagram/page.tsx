import { onIntegrate } from '@/actions/integrations'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  searchParams: {
    code: string
    error?: string
    error_reason?: string
    error_description?: string
  }
}

const Page = async ({ searchParams }: Props) => {
  const { code, error, error_reason, error_description } = searchParams

  // Handle Instagram OAuth errors
  if (error) {
    console.error('🔴 Instagram OAuth Error:', { error, error_reason, error_description })
    return redirect(`/dashboard?error=${error}&reason=${error_reason}`)
  }

  if (code) {
    console.log('🔵 Instagram OAuth code received:', code.substring(0, 20) + '...')
    const cleanCode = code.split('#_')[0]
    const user = await onIntegrate(cleanCode)
    
    console.log('🔵 Integration result:', { status: user.status })
    
    if (user.status === 200) {
      return redirect(
        `/dashboard/${user.data?.firstname}${user.data?.lastname}/integrations?success=true`
      )
    }
    
    // Handle different error statuses
    if (user.status === 401) {
      return redirect('/dashboard?error=token_failed')
    }
    
    if (user.status === 404) {
      return redirect('/dashboard?error=user_not_found')
    }
    
    if (user.status === 500) {
      return redirect('/dashboard?error=server_error')
    }
  }
  
  return redirect('/sign-up')
}

export default Page

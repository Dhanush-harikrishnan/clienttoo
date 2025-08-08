import { onBoardUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const Page = async (props: Props) => {
  try {
    const user = await onBoardUser()
    
    if (user.status === 200 || user.status === 201) {
      if (user.data?.firstname && user.data?.lastname) {
        return redirect(`/dashboard/${user.data.firstname}${user.data.lastname}`)
      }
      // Fallback if user data is incomplete
      return redirect('/dashboard/setup')
    }
  } catch (error) {
    console.error('Dashboard redirect error:', error)
  }

  return redirect('/sign-in')
}

export default Page

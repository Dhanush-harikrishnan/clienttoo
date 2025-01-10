import { SignIn } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <SignIn />
      </div>
    </div>
  )
}

export default page
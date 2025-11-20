'use client'

import { Button } from '@/components/ui/button'
import React, { useMemo } from 'react'
import Loader from '../loader'
import { AutomationDuoToneWhite } from '@/icons'
import { useCreateAutomation } from '@/hooks/use-automations'
import { useRouter, usePathname } from 'next/navigation'
import { v4 } from 'uuid'

type Props = {}

const CreateAutomation = (props: Props) => {
  const mutationId = useMemo(() => v4(), [])
  const router = useRouter()
  const pathname = usePathname()

  console.log(mutationId)
  const { isPending, mutate } = useCreateAutomation(mutationId)

  const handleCreate = () => {
    mutate(
      {
        name: 'Untitled',
        id: mutationId,
        createdAt: new Date(),
        keywords: [],
      },
      {
        onSuccess: () => {
          // Navigate to the new automation after successful creation
          router.push(`${pathname}/${mutationId}`)
        }
      }
    )
  }

  return (
    <Button
      className="lg:px-10 py-6 bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] font-medium to-[#1C2D70]"
      onClick={handleCreate}
    >
      <Loader state={isPending}>
        <AutomationDuoToneWhite />
        <p className="lg:inline hidden">Create an Automation</p>
      </Loader>
    </Button>
  )
}

export default CreateAutomation

'use client'

import { Button } from '@/components/ui/button'
import React, { useMemo } from 'react'
import Loader from '../loader'
import { AutomationDuoToneWhite } from '@/icons'
import { useCreateAutomation } from '@/hooks/use-automations'
import { useQueryAutomations } from '@/hooks/user-queries'
import { useRouter, usePathname } from 'next/navigation'
import { v4 } from 'uuid'

type Props = {}

const CreateAutomation = (props: Props) => {
  const mutationId = useMemo(() => v4(), [])
  const router = useRouter()
  const pathname = usePathname()
  const { data } = useQueryAutomations()

  const { isPending, mutate } = useCreateAutomation(mutationId)

  const generateUniqueName = () => {
    const existing = data?.data || []
    const untitledNames = existing
      .map((a: any) => a.name)
      .filter((name: string) => /^Untitled(\s\d+)?$/.test(name))

    if (untitledNames.length === 0) return 'Untitled'

    const numbers = untitledNames.map((name: string) => {
      const match = name.match(/^Untitled\s(\d+)$/)
      return match ? parseInt(match[1], 10) : 1
    })
    return `Untitled ${Math.max(...numbers) + 1}`
  }

  const handleCreate = () => {
    const name = generateUniqueName()
    mutate(
      {
        name,
        id: mutationId,
        createdAt: new Date(),
        keywords: [],
      },
      {
        onSuccess: () => {
          router.push(`${pathname}/${mutationId}`)
        }
      }
    )
  }

  return (
    <Button
      className="lg:px-10 py-6 bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] font-medium to-[#1C2D70]"
      onClick={handleCreate}
      disabled={isPending}
    >
      <Loader state={isPending}>
        <AutomationDuoToneWhite />
        <p className="lg:inline hidden">Create an Automation</p>
      </Loader>
    </Button>
  )
}

export default CreateAutomation

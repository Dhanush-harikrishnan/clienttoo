'use server'

import { redirect } from 'next/navigation'
import { onCurrentUser } from '../user'
import { createIntegration, getIntegration, updateIntegration } from './queries'
import { generateTokens } from '@/lib/fetch'
import axios from 'axios'

export const onOAuthInstagram = (strategy: 'INSTAGRAM' | 'CRM') => {
  if (strategy === 'INSTAGRAM') {
    return redirect(process.env.INSTAGRAM_EMBEDDED_OAUTH_URL as string)
  }
}

export const onIntegrate = async (code: string) => {
  const user = await onCurrentUser()

  try {
    console.log('🔵 Starting integration for user:', user.id)
    const integration = await getIntegration(user.id)
    console.log('🔵 Current integration status:', { 
      hasIntegration: !!integration, 
      integrationCount: integration?.integrations.length 
    })

    // Check if user already has an Instagram integration
    if (integration && integration.integrations.length > 0) {
      console.log('🟡 User already has an integration, updating token...')
      const token = await generateTokens(code)
      console.log('🟡 Token generated:', !!token)

      if (token) {
        const insta_id = await axios.get(
          `${process.env.INSTAGRAM_BASE_URL}/me?fields=user_id&access_token=${token.access_token}`
        )
        console.log('🟡 Instagram ID fetched:', insta_id.data.user_id)

        const today = new Date()
        const expire_date = today.setDate(today.getDate() + 60)
        
        // Update existing integration
        await updateIntegration(
          token.access_token,
          new Date(expire_date),
          integration.integrations[0].id
        )
        console.log('✅ Integration updated successfully')
        return { 
          status: 200, 
          data: { 
            firstname: integration.firstname, 
            lastname: integration.lastname 
          } 
        }
      }
    }

    // Create new integration if user doesn't have one
    if (integration && integration.integrations.length === 0) {
      console.log('🟢 Creating new integration...')
      const token = await generateTokens(code)
      console.log('🟢 Token generated:', !!token)

      if (token) {
        const insta_id = await axios.get(
          `${process.env.INSTAGRAM_BASE_URL}/me?fields=user_id&access_token=${token.access_token}`
        )
        console.log('🟢 Instagram ID fetched:', insta_id.data.user_id)

        const today = new Date()
        const expire_date = today.setDate(today.getDate() + 60)
        const create = await createIntegration(
          user.id,
          token.access_token,
          new Date(expire_date),
          insta_id.data.user_id
        )
        console.log('✅ Integration created successfully')
        return { status: 200, data: create }
      }
      console.log('🔴 401 - Failed to generate token')
      return { status: 401, message: 'Failed to generate access token' }
    }
    console.log('🔴 404 - User not found')
    return { status: 404, message: 'User not found' }
  } catch (error) {
    console.error('🔴 500 - Integration error:', error)
    return { status: 500, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}

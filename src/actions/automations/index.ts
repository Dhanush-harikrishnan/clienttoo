'use server'

import { onCurrentUser } from '../user'
import { findUser } from '../user/queries'
import {
  addKeyWord,
  addListener,
  addPost,
  createAutomation,
  deleteAutomationQuery,
  deleteKeywordQuery,
  findAutomation,
  getAutomations,
  saveTrigger,
  updateAutomation,
} from './queries'
import { client } from '@/lib/prisma'

export const createAutomations = async (id?: string) => {
  const user = await onCurrentUser()
  try {
    const create = await createAutomation(user.id, id)
    if (create) return { status: 200, data: 'Automation created', res: create }

    return { status: 404, data: 'Oops! something went wrong' }
  } catch (error) {
    return { status: 500, data: 'Internal server error' }
  }
}

export const getAllAutomations = async () => {
  const user = await onCurrentUser()
  try {
    const automations = await getAutomations(user.id)
    if (automations) return { status: 200, data: automations.automations }
    return { status: 404, data: [] }
  } catch (error) {
    return { status: 500, data: [] }
  }
}

export const getAutomationInfo = async (id: string) => {
  await onCurrentUser()
  try {
    const automation = await findAutomation(id)
    if (automation) return { status: 200, data: automation }

    return { status: 404 }
  } catch (error) {
    return { status: 500 }
  }
}

export const updateAutomationName = async (
  automationId: string,
  data: {
    name?: string
    active?: boolean
    automation?: string
  }
) => {
  await onCurrentUser()
  try {
    const update = await updateAutomation(automationId, data)
    if (update) {
      return { status: 200, data: 'Automation successfully updated' }
    }
    return { status: 404, data: 'Oops! could not find automation' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const saveListener = async (
  autmationId: string,
  listener: 'GEMINI' | 'MESSAGE',
  prompt: string,
  reply?: string
) => {
  await onCurrentUser()
  try {
    console.log("Saving listener:", { autmationId, listener, prompt, reply });
    
    if (!prompt || prompt.trim().length === 0) {
      return { status: 400, data: 'Please provide a response prompt' }
    }
    
    // Ensure reply is a string even if undefined
    const safeReply = reply || "";
    const create = await addListener(autmationId, listener, prompt, safeReply)
    if (create) {
      return { status: 200, data: 'Response settings saved successfully' }
    }
    return { status: 404, data: 'Automation not found' }
  } catch (error) {
    console.error("Error saving listener:", error);
    // More detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { 
      status: 500, 
      data: 'Failed to save response settings. Please try again.', 
      error: errorMessage
    }
  }
}

export const onSaveTrigger = async (
  automationId: string,
  trigger: 'DM' | 'COMMENT'
) => {
  await onCurrentUser()
  try {
    const create = await saveTrigger(automationId, trigger)
    if (create) {
      return { status: 200, data: 'Trigger saved successfully' }
    }
    return { status: 404, data: 'Automation not found' }
  } catch (error) {
    console.error('Error saving trigger:', error)
    return { status: 500, data: 'Failed to save trigger. Please try again.' }
  }
}

export const saveKeyword = async (automationId: string, keyword: string) => {
  await onCurrentUser()
  try {
    if (!keyword || keyword.trim().length === 0) {
      return { status: 400, data: 'Please provide a keyword' }
    }
    
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length > 50) {
      return { status: 400, data: 'Keyword too long (max 50 characters)' }
    }
    
    // Check if automation exists
    const automation = await client.automation.findUnique({
      where: { id: automationId },
      include: { keywords: true }
    });
    
    if (!automation) {
      return { status: 404, data: 'Automation not found' }
    }
    
    // Check for duplicate keywords
    const existingKeyword = automation.keywords.find(
      (k: any) => k.word.toLowerCase() === trimmedKeyword.toLowerCase()
    );
    
    if (existingKeyword) {
      return { status: 400, data: 'This keyword already exists' }
    }

    const create = await addKeyWord(automationId, trimmedKeyword)

    if (create) return { status: 200, data: 'Keyword added successfully' }

    return { status: 404, data: 'Failed to add keyword' }
  } catch (error) {
    console.error('Error saving keyword:', error)
    return { status: 500, data: 'Failed to save keyword. Please try again.' }
  }
}

export const deleteKeyword = async (id: string) => {
  await onCurrentUser()
  try {
    const deleted = await deleteKeywordQuery(id)
    if (deleted)
      return {
        status: 200,
        data: 'Keyword deleted',
      }
    return { status: 404, data: 'Keyword not found' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const getProfilePosts = async () => {
  const user = await onCurrentUser()
  try {
    const profile = await findUser(user.id)
    console.log('📊 Profile check:', { 
      hasProfile: !!profile, 
      hasIntegrations: !!profile?.integrations,
      integrationsCount: profile?.integrations?.length 
    })
    
    if (!profile || !profile.integrations || !profile.integrations[0]) {
      console.log('🔴 Error: Profile or integrations not found')
      return { status: 404, data: { message: 'Profile or integrations not found' } }
    }

    const integration = profile.integrations[0]
    console.log('🔗 Integration details:', {
      id: integration.id,
      name: integration.name,
      hasToken: !!integration.token,
      instagramId: integration.instagramId
    })

    const url = `${process.env.INSTAGRAM_BASE_URL}/me/media?fields=id,caption,media_url,media_type,timestamp&limit=10&access_token=${integration.token}`
    console.log('📡 Fetching Instagram posts...')
    
    const response = await fetch(url)
    const parsed = await response.json()
    
    console.log('📥 Instagram API Response:', {
      status: response.status,
      ok: response.ok,
      hasData: !!parsed.data,
      dataCount: parsed.data?.length,
      error: parsed.error
    })

    if (parsed.error) {
      console.log('🔴 Instagram API Error:', parsed.error)
      return { 
        status: 400, 
        data: { 
          message: parsed.error.message || 'Instagram API error',
          error: parsed.error 
        } 
      }
    }

    if (parsed.data && Array.isArray(parsed.data)) {
      console.log('✅ Successfully fetched', parsed.data.length, 'posts')
      return { status: 200, data: parsed }
    }
    
    console.log('🔴 No posts data in response')
    return { status: 404, data: { message: 'No posts found' } }
  } catch (error) {
    console.error('🔴 Server error in getting posts:', error)
    return { 
      status: 500, 
      data: { 
        message: 'Server error while fetching posts',
        error: error instanceof Error ? error.message : 'Unknown error'
      } 
    }
  }
}

export const savePosts = async (
  autmationId: string,
  posts: {
    postid: string
    caption?: string
    media: string
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'
  }[]
) => {
  await onCurrentUser()
  try {
    if (!posts || posts.length === 0) {
      return { status: 400, data: 'Please select at least one post' }
    }
    
    const create = await addPost(autmationId, posts)
    if (create) {
      return { status: 200, data: 'Posts attached successfully' }
    }
    return { status: 404, data: 'Automation not found' }
  } catch (error) {
    console.error('Error saving posts:', error)
    return { status: 500, data: 'Failed to attach posts. Please try again.' }
  }
}

export const activateAutomation = async (id: string, state: boolean) => {
  await onCurrentUser()
  try {
    const update = await updateAutomation(id, { active: state })
    if (update)
      return {
        status: 200,
        data: `Automation ${state ? 'activated' : 'disabled'}`,
      }
    return { status: 404, data: 'Automation not found' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const deleteAutomation = async (id: string) => {
  await onCurrentUser()
  try {
    const deleted = await deleteAutomationQuery(id)
    if (deleted)
      return {
        status: 200,
        data: 'Automation deleted successfully',
      }
    return { status: 404, data: 'Automation not found' }
  } catch (error) {
    console.error("Error deleting automation:", error);
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

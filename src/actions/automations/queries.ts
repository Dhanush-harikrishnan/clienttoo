'use server'

import { client } from '@/lib/prisma'
import { v4 } from 'uuid'

export const createAutomation = async (clerkId: string, id?: string) => {
  return await client.user.update({
    where: {
      clerkId,
    },
    data: {
      automations: {
        create: {
          ...(id && { id }),
        },
      },
    },
  })
}

export const getAutomations = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      automations: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          keywords: true,
          listener: true,
        },
      },
    },
  })
}

export const findAutomation = async (id: string) => {
  return await client.automation.findUnique({
    where: {
      id,
    },
    include: {
      keywords: true,
      trigger: true,
      posts: true,
      listener: true,
      User: {
        include: {
          integrations: true,
        },
      },
    },
  })
}

export const updateAutomation = async (
  id: string,
  update: {
    name?: string
    active?: boolean
  }
) => {
  return await client.automation.update({
    where: { id },
    data: {
      name: update.name,
      active: update.active,
    },
  })
}

export const addListener = async (
  automationId: string,
  listener: 'GEMINI' | 'MESSAGE',
  prompt: string,
  reply?: string
) => {
  try {
    console.log("DB addListener called with:", { automationId, listener, prompt, reply });
    
    // Check if listener already exists for this automation
    const existingListener = await client.listener.findUnique({
      where: { automationId }
    });
    
    // WORKAROUND: Always use MESSAGE since GEMINI appears to be invalid in the DB enum
    // When database schema is updated, this can be changed back to use the correct value
    const dbListener = 'MESSAGE'; // Temporarily use MESSAGE for all listener types
    
    // Also store the original listener type in the prompt to distinguish between them
    const enhancedPrompt = listener === 'GEMINI' 
      ? `[GEMINI_AI_MODE] ${prompt}` 
      : prompt;
    
    if (existingListener) {
      // Update existing listener
      return await client.listener.update({
        where: { automationId },
        data: {
          listener: dbListener,
          prompt: enhancedPrompt,
          commentReply: reply || null,
        },
      });
    } else {
      // Create new listener
      return await client.automation.update({
        where: {
          id: automationId,
        },
        data: {
          listener: {
            create: {
              listener: dbListener,
              prompt: enhancedPrompt,
              commentReply: reply || null,
            },
          },
        },
      });
    }
  } catch (error) {
    console.error("Database error in addListener:", error);
    throw error;
  }
}

export const addTrigger = async (automationId: string, trigger: string[]) => {
  if (trigger.length === 2) {
    return await client.automation.update({
      where: { id: automationId },
      data: {
        trigger: {
          createMany: {
            data: [{ type: trigger[0] }, { type: trigger[1] }],
          },
        },
      },
    })
  }
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      trigger: {
        create: {
          type: trigger[0],
        },
      },
    },
  })
}

export const addKeyWord = async (automationId: string, keyword: string) => {
  return client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      keywords: {
        create: {
          word: keyword,
        },
      },
    },
  })
}

export const deleteKeywordQuery = async (id: string) => {
  return client.keyword.delete({
    where: { id },
  })
}

export const addPost = async (
  autmationId: string,
  posts: {
    postid: string
    caption?: string
    media: string
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'
  }[]
) => {
  return await client.automation.update({
    where: {
      id: autmationId,
    },
    data: {
      posts: {
        createMany: {
          data: posts,
        },
      },
    },
  })
}

export const deleteAutomationQuery = async (id: string) => {
  return client.automation.delete({
    where: { id },
  });
}

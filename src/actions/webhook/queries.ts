import { client } from '@/lib/prisma'
import { LISTENERS } from '@prisma/client'

interface ChatMessage {
  role: 'assistant' | 'user'
  content: string
}

export const matchKeyword = async (text: string) => {
  const keywords = await client.keyword.findMany({
    where: {
      OR: [
        { word: { equals: text, mode: 'insensitive' } },
        { word: { in: text.toLowerCase().split(' '), mode: 'insensitive' } }
      ],
    },
    include: {
      Automation: {
        select: {
          id: true,
          active: true,
        },
      },
    },
  });

  return keywords.find(k => k.Automation?.active) || null;
}

export const getKeywordAutomation = async (automationId: string, dm: boolean) => {
  try {
    const automation = await client.automation.findUnique({
      where: { id: automationId },
      include: {
        dms: dm,
        trigger: {
          where: { type: dm ? 'DM' : 'COMMENT' },
        },
        listener: true,
        User: {
          select: {
            subscription: {
              select: { plan: true },
            },
            integrations: {
              select: { token: true },
            },
          },
        },
      },
    });

    if (!automation?.trigger?.length) {
      console.log('No triggers found for automation:', automationId);
      return null;
    }

    return automation;
  } catch (error) {
    console.error('Error getting keyword automation:', error);
    throw error;
  }
}

export const trackResponses = async (automationId: string, type: 'COMMENT' | 'DM') => {
  return await client.listener.update({
    where: { automationId },
    data: {
      [type === 'COMMENT' ? 'commentCount' : 'dmCount']: { increment: 1 },
    },
  });
}

export const createChatHistory = (
  automationId: string,
  sender: string,
  receiver: string,
  message: string
) => {
  return client.automation.update({
    where: { id: automationId },
    data: {
      dms: {
        create: {
          reciever: receiver,
          senderId: sender,
          message,
        },
      },
    },
  });
}

export const getKeywordPost = async (postId: string, automationId: string) => {
  return await client.post.findFirst({
    where: {
      AND: [{ postid: postId }, { automationId }],
    },
    select: { automationId: true },
  });
}

export const getChatHistory = async (sender: string, receiver: string): Promise<{
  history: ChatMessage[];
  automationId: string | null;
}> => {
  const history = await client.dms.findMany({
    where: {
      AND: [{ senderId: sender }, { reciever: receiver }],
    },
    orderBy: { createdAt: 'asc' },
  });

  const chatSession = history.map((chat): ChatMessage => ({
    role: chat.reciever ? 'assistant' : 'user',
    content: chat.message || '',
  }));

  return {
    history: chatSession,
    automationId: history.length > 0 ? history[history.length - 1].automationId || null : null,
  };
}


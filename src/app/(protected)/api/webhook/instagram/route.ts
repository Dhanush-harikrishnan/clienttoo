import { findAutomation } from '@/actions/automations/queries'
import {
  createChatHistory,
  getChatHistory,
  getKeywordAutomation,
  getKeywordPost,
  matchKeyword,
  trackResponses,
} from '@/actions/webhook/queries'
import { sendDM, sendPrivateMessage } from '@/lib/fetch'
import { gemini } from '@/lib/gemini'
import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const hub = req.nextUrl.searchParams.get('hub.challenge')
  return new NextResponse(hub)
}

export async function POST(req: NextRequest) {
  const webhook_payload = await req.json()
  let matcher
  try {
    // Handle Direct Messages (DM Trigger)
    if (webhook_payload.entry[0].messaging) {
      matcher = await matchKeyword(
        webhook_payload.entry[0].messaging[0].message.text
      )
    }

    // Handle Comments (COMMENT Trigger)
    if (webhook_payload.entry[0].changes) {
      matcher = await matchKeyword(
        webhook_payload.entry[0].changes[0].value.text
      )
    }

    if (matcher && matcher.automationId) {
      console.log('Keyword matched for automation:', matcher.automationId)
      
      // Handle DM Trigger: User sends me a dm with a keyword
      if (webhook_payload.entry[0].messaging) {
        const automation = await getKeywordAutomation(
          matcher.automationId,
          true // This is for DM trigger
        )

        if (automation) {
          console.log('Processing DM trigger automation')
          
          if (
            automation.listener &&
            automation.listener.listener === 'MESSAGE' &&
            !automation.listener.prompt.includes('[GEMINI_AI_MODE]')
          ) {
            const direct_message = await sendDM(
              webhook_payload.entry[0].id,
              webhook_payload.entry[0].messaging[0].sender.id,
              automation.listener?.prompt,
              automation.User?.integrations[0].token!
            )

            if (direct_message.status === 200) {
              const tracked = await trackResponses(automation.id, 'DM')
              if (tracked) {
                return NextResponse.json(
                  {
                    message: 'DM sent successfully',
                  },
                  { status: 200 }
                )
              }
            }
          }

          if (
            automation.listener &&
            (automation.listener.listener === 'GEMINI' || 
             automation.listener.prompt.includes('[GEMINI_AI_MODE]'))
          ) {
            const prompt = automation.listener.prompt.replace('[GEMINI_AI_MODE]', '').trim();
            try {
              const smart_ai_message = await gemini.chat.completions.create({
                messages: [
                  {
                    role: 'user',
                    content: `${prompt}: Keep responses under 2 sentences`,
                  },
                ],
              });

              const responseText = smart_ai_message.choices[0].message.content;
              if (responseText) {
                const reciever = createChatHistory(
                  automation.id,
                  webhook_payload.entry[0].id,
                  webhook_payload.entry[0].messaging[0].sender.id,
                  responseText
                )

                const sender = createChatHistory(
                  automation.id,
                  webhook_payload.entry[0].id,
                  webhook_payload.entry[0].messaging[0].sender.id,
                  responseText
                )

                await client.$transaction([reciever, sender])

                const direct_message = await sendDM(
                  webhook_payload.entry[0].id,
                  webhook_payload.entry[0].messaging[0].sender.id,
                  responseText,
                  automation.User?.integrations[0].token!
                )

                if (direct_message.status === 200) {
                  const tracked = await trackResponses(automation.id, 'DM')
                  if (tracked) {
                    return NextResponse.json(
                      {
                        message: 'Message sent',
                      },
                      { status: 200 }
                    )
                  }
                }
              }
            } catch (error) {
              console.error('Error in Gemini API call:', error);
              const errorMessage = typeof error === 'object' && error !== null 
                ? (error as any).response?.data?.error?.message || (error as any).message || 'Unknown error' 
                : 'Unknown error';
              const errorCode = typeof error === 'object' && error !== null 
                ? (error as any).response?.status || 500
                : 500;
              
              console.error(`Gemini API Error (${errorCode}): ${errorMessage}`);
              
              return NextResponse.json(
                {
                  message: 'Error in Gemini API call',
                  error: errorMessage,
                  code: errorCode
                },
                { status: 500 }
              );
            }
          }
        }
      }

      // Handle COMMENT Trigger: User comments on my post
      if (
        webhook_payload.entry[0].changes &&
        webhook_payload.entry[0].changes[0].field === 'comments'
      ) {
        const automation = await getKeywordAutomation(
          matcher.automationId,
          false // This is for COMMENT trigger
        )

        console.log('Processing COMMENT trigger automation')

        const automations_post = await getKeywordPost(
          webhook_payload.entry[0].changes[0].value.media.id,
          automation?.id!
        )

        console.log('Found keyword in selected post:', automations_post)

        if (automation && automations_post) {
          console.log('Comment trigger validation passed')
          
          if (automation.listener) {
            if (
              automation.listener.listener === 'MESSAGE' && 
              !automation.listener.prompt.includes('[GEMINI_AI_MODE]')) {
              console.log(
                'Sending DM for comment trigger',
                'Comment from:',
                webhook_payload.entry[0].changes[0].value.from.id
              )

              const direct_message = await sendPrivateMessage(
                webhook_payload.entry[0].id,
                webhook_payload.entry[0].changes[0].value.id,
                automation.listener?.prompt,
                automation.User?.integrations[0].token!
              )

              console.log('DM sent for comment trigger:', direct_message.data)
              if (direct_message.status === 200) {
                const tracked = await trackResponses(automation.id, 'COMMENT')

                if (tracked) {
                  return NextResponse.json(
                    {
                      message: 'Comment trigger - DM sent successfully',
                    },
                    { status: 200 }
                  )
                }
              }
            }
            
            if (
              automation.listener.listener === 'GEMINI' ||
              automation.listener.prompt.includes('[GEMINI_AI_MODE]')
            ) {
              const prompt = automation.listener.prompt.replace('[GEMINI_AI_MODE]', '').trim();
              try {
                const smart_ai_message = await gemini.chat.completions.create({
                  messages: [
                    {
                      role: 'user',
                      content: `${prompt}: Keep responses under 2 sentences`,
                    },
                  ],
                });

                const responseText = smart_ai_message.choices[0].message.content;
                if (responseText) {
                  const reciever = createChatHistory(
                    automation.id,
                    webhook_payload.entry[0].id,
                    webhook_payload.entry[0].changes[0].value.from.id,
                    responseText
                  )

                  const sender = createChatHistory(
                    automation.id,
                    webhook_payload.entry[0].id,
                    webhook_payload.entry[0].changes[0].value.from.id,
                    responseText
                  )

                  await client.$transaction([reciever, sender])

                  const direct_message = await sendPrivateMessage(
                    webhook_payload.entry[0].id,
                    webhook_payload.entry[0].changes[0].value.id,
                    automation.listener?.prompt,
                    automation.User?.integrations[0].token!
                  )

                  if (direct_message.status === 200) {
                    const tracked = await trackResponses(automation.id, 'COMMENT')

                    if (tracked) {
                      return NextResponse.json(
                        {
                          message: 'Message sent',
                        },
                        { status: 200 }
                      )
                    }
                  }
                }
              } catch (error) {
                console.error('Error in Gemini API call:', error);
                const errorMessage = typeof error === 'object' && error !== null 
                  ? (error as any).response?.data?.error?.message || (error as any).message || 'Unknown error' 
                  : 'Unknown error';
                const errorCode = typeof error === 'object' && error !== null 
                  ? (error as any).response?.status || 500
                  : 500;
                
                console.error(`Gemini API Error (${errorCode}): ${errorMessage}`);
                
                return NextResponse.json(
                  {
                    message: 'Error in Gemini API call',
                    error: errorMessage,
                    code: errorCode
                  },
                  { status: 500 }
                );
              }
            }
          }
        }
      }
    }

    if (!matcher) {
      const customer_history = await getChatHistory(
        webhook_payload.entry[0].messaging[0].recipient.id,
        webhook_payload.entry[0].messaging[0].sender.id
      )

      if (customer_history.history.length > 0) {
        const automation = await findAutomation(customer_history.automationId!)

        if (
          automation?.listener?.listener === 'GEMINI' ||
          automation?.listener?.prompt.includes('[GEMINI_AI_MODE]')
        ) {
          const prompt = automation.listener.prompt.replace('[GEMINI_AI_MODE]', '').trim();
          try {
            const smart_ai_message = await gemini.chat.completions.create({
              messages: [
                {
                  role: 'user',
                  content: `${prompt}: Answer the message and keep it under 3 sentences ${
                    customer_history.history
                      .map((i: any) => `${i.senderId === 'SYSTEM' ? 'Bot:' : 'User:'} ${i.message}`)
                      .join(' ')
                  }`,
                },
              ],
            });

            const responseText = smart_ai_message.choices[0].message.content;
            if (responseText) {
              const reciever = createChatHistory(
                automation.id,
                webhook_payload.entry[0].id,
                webhook_payload.entry[0].messaging[0].sender.id,
                webhook_payload.entry[0].messaging[0].message.text
              )

              const sender = createChatHistory(
                automation.id,
                webhook_payload.entry[0].id,
                webhook_payload.entry[0].messaging[0].sender.id,
                responseText
              )
              await client.$transaction([reciever, sender])
              const direct_message = await sendDM(
                webhook_payload.entry[0].id,
                webhook_payload.entry[0].messaging[0].sender.id,
                responseText,
                automation.User?.integrations[0].token!
              )

              if (direct_message.status === 200) {
                //if successfully send we return

                return NextResponse.json(
                  {
                    message: 'Message sent',
                  },
                  { status: 200 }
                )
              }
            }
          } catch (error) {
            console.error('Error in Gemini API call:', error);
            const errorMessage = typeof error === 'object' && error !== null 
              ? (error as any).response?.data?.error?.message || (error as any).message || 'Unknown error' 
              : 'Unknown error';
            const errorCode = typeof error === 'object' && error !== null 
              ? (error as any).response?.status || 500
              : 500;
            
            console.error(`Gemini API Error (${errorCode}): ${errorMessage}`);
            
            return NextResponse.json(
              {
                message: 'Error in Gemini API call',
                error: errorMessage,
                code: errorCode
              },
              { status: 500 }
            );
          }
        }
      }

      return NextResponse.json(
        {
          message: 'No automation set',
        },
        { status: 200 }
      )
    }
    return NextResponse.json(
      {
        message: 'No automation set',
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: 'No automation set',
      },
      { status: 200 }
    )
  }
}

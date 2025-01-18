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
import { openai } from '@/lib/openai'
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
    // Extract message text from webhook payload
    const messageText = webhook_payload.entry[0].messaging 
      ? webhook_payload.entry[0].messaging[0].message.text
      : webhook_payload.entry[0].changes 
        ? webhook_payload.entry[0].changes[0].value.text
        : null;

    if (!messageText) {
      return NextResponse.json({ message: 'No message text found' }, { status: 200 });
    }

    // Try to match keywords
    matcher = await matchKeyword(messageText);

    if (matcher && matcher.Automation?.active) {
      const automation = await getKeywordAutomation(
        matcher.Automation.id,
        !!webhook_payload.entry[0].messaging // true for DM, false for comments
      );

      if (!automation || !automation.trigger || !automation.listener) {
        return NextResponse.json({ message: 'No valid automation found' }, { status: 200 });
      }

      // Handle message based on listener type
      if (automation.listener.listener === 'MESSAGE') {
        const response = webhook_payload.entry[0].messaging
          ? await sendDM(
              webhook_payload.entry[0].id,
              webhook_payload.entry[0].messaging[0].sender.id,
              automation.listener.prompt,
              automation.User?.integrations[0].token!
            )
          : await sendPrivateMessage(
              webhook_payload.entry[0].id,
              webhook_payload.entry[0].changes[0].value.id,
              automation.listener.prompt,
              automation.User?.integrations[0].token!
            );

        if (response.status === 200) {
          await trackResponses(automation.id, webhook_payload.entry[0].messaging ? 'DM' : 'COMMENT');
          return NextResponse.json({ message: 'Response sent successfully' }, { status: 200 });
        }
      }

      // Handle Smart AI responses
      if (automation.listener.listener === 'SMARTAI' && automation.User?.subscription?.plan === 'PRO') {
        const aiResponse = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'assistant',
              content: `${automation.listener.prompt}: Keep responses under 2 sentences`,
            },
          ],
        });

        if (aiResponse.choices[0].message.content) {
          // Create chat history
          const senderId = webhook_payload.entry[0].messaging
            ? webhook_payload.entry[0].messaging[0].sender.id
            : webhook_payload.entry[0].changes[0].value.from.id;

          await client.$transaction([
            createChatHistory(automation.id, webhook_payload.entry[0].id, senderId, messageText),
            createChatHistory(automation.id, webhook_payload.entry[0].id, senderId, aiResponse.choices[0].message.content)
          ]);

          // Send response
          const response = webhook_payload.entry[0].messaging
            ? await sendDM(
                webhook_payload.entry[0].id,
                senderId,
                aiResponse.choices[0].message.content,
                automation.User?.integrations[0].token!
              )
            : await sendPrivateMessage(
                webhook_payload.entry[0].id,
                webhook_payload.entry[0].changes[0].value.id,
                aiResponse.choices[0].message.content,
                automation.User?.integrations[0].token!
              );

          if (response.status === 200) {
            await trackResponses(automation.id, webhook_payload.entry[0].messaging ? 'DM' : 'COMMENT');
            return NextResponse.json({ message: 'AI response sent successfully' }, { status: 200 });
          }
        }
      }
    }

    // Handle continued conversations
    if (!matcher && webhook_payload.entry[0].messaging) {
      console.log('Matched')
      // We have a keyword matcher

      if (webhook_payload.entry[0].messaging) {
        const automation = await getKeywordAutomation(
          matcher.automationId,
          true
        )

        if (automation && automation.trigger) {
          if (
            automation.listener &&
            automation.listener.listener === 'MESSAGE'
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
                    message: 'Message sent',
                  },
                  { status: 200 }
                )
              }
            }
          }

          if (
            automation.listener &&
            automation.listener.listener === 'SMARTAI' &&
            automation.User?.subscription?.plan === 'PRO'
          ) {
            const smart_ai_message = await openai.chat.completions.create({
              model: 'gpt-4o',
              messages: [
                {
                  role: 'assistant',
                  content: `${automation.listener?.prompt}: Keep responses under 2 sentences`,
                },
              ],
            })

            if (smart_ai_message.choices[0].message.content) {
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
                smart_ai_message.choices[0].message.content
              )

              await client.$transaction([reciever, sender])

              const direct_message = await sendDM(
                webhook_payload.entry[0].id,
                webhook_payload.entry[0].messaging[0].sender.id,
                smart_ai_message.choices[0].message.content,
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
          }
        }
      }

      if (
        webhook_payload.entry[0].changes &&
        webhook_payload.entry[0].changes[0].field === 'comments'
      ) {
        const automation = await getKeywordAutomation(
          matcher.automationId,
          false
        )

        console.log('geting the automations')

        const automations_post = await getKeywordPost(
          webhook_payload.entry[0].changes[0].value.media.id,
          automation?.id!
        )

        console.log('found keyword ', automations_post)

        if (automation && automations_post && automation.trigger) {
          console.log('first if')
          if (automation.listener) {
            console.log('first if')
            if (automation.listener.listener === 'MESSAGE') {
              console.log(
                'SENDING DM, WEB HOOK PAYLOAD',
                webhook_payload,
                'changes',
                webhook_payload.entry[0].changes[0].value.from
              )

              console.log(
                'COMMENT VERSION:',
                webhook_payload.entry[0].changes[0].value.from.id
              )

              const direct_message = await sendPrivateMessage(
                webhook_payload.entry[0].id,
                webhook_payload.entry[0].changes[0].value.id,
                automation.listener?.prompt,
                automation.User?.integrations[0].token!
              )

              console.log('DM SENT', direct_message.data)
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
            if (
              automation.listener.listener === 'SMARTAI' &&
              automation.User?.subscription?.plan === 'PRO'
            ) {
              const smart_ai_message = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                  {
                    role: 'assistant',
                    content: `${automation.listener?.prompt}: keep responses under 2 sentences`,
                  },
                ],
              })
              if (smart_ai_message.choices[0].message.content) {
                const reciever = createChatHistory(
                  automation.id,
                  webhook_payload.entry[0].id,
                  webhook_payload.entry[0].changes[0].value.from.id,
                  webhook_payload.entry[0].changes[0].value.text
                )

                const sender = createChatHistory(
                  automation.id,
                  webhook_payload.entry[0].id,
                  webhook_payload.entry[0].changes[0].value.from.id,
                  smart_ai_message.choices[0].message.content
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
          automation?.User?.subscription?.plan === 'PRO' &&
          automation.listener?.listener === 'SMARTAI'
        ) {
          const smart_ai_message = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'assistant',
                content: `${automation.listener?.prompt}: keep responses under 2 sentences`,
              },
              ...customer_history.history,
              {
                role: 'user',
                content: webhook_payload.entry[0].messaging[0].message.text,
              },
            ],
          })

          if (smart_ai_message.choices[0].message.content) {
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
              smart_ai_message.choices[0].message.content
            )
            await client.$transaction([reciever, sender])
            const direct_message = await sendDM(
              webhook_payload.entry[0].id,
              webhook_payload.entry[0].messaging[0].sender.id,
              smart_ai_message.choices[0].message.content,
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
        }
      }

      return NextResponse.json(
        {
          message: 'No automation set',
        },
        { status: 200 }
      )
    }
    return NextResponse.json({ message: 'No matching automation found' }, { status: 200 });
    } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Error processing webhook', error }, { status: 200 });
    }
  }


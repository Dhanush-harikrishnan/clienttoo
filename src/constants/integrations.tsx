import { InstagramDuoToneBlue, SalesForceDuoToneBlue } from "@/icons"

type Props = {
  title: string
  icon: React.ReactNode
  description: string
  strategy: 'INSTAGRAM' | 'CRM'
}

export const INTEGRATION_CARDS: Props[] = [
  {
    title: 'Connect Instagram',
    description:
      'Link your Instagram Business account to automate replies to comments and DMs.',
    icon: <InstagramDuoToneBlue />,
    strategy: 'INSTAGRAM',
    
  },
  {
    title: 'Connect Salesforce',
    description:
      'Sync your leads and contacts with Salesforce CRM for seamless follow-ups.',
    icon: <SalesForceDuoToneBlue />,
    strategy: 'CRM',
  },
]

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const features = [
    {
      title: 'Smart Automation',
      description: 'Streamline your Instagram workflow with intelligent automation.',
      benefits: ['24/7 engagement', 'Custom response patterns', 'Schedule management']
    },
    {
      title: 'Analytics Dashboard',
      description: 'Make data-driven decisions with comprehensive insights.',
      benefits: ['Real-time metrics', 'Growth tracking', 'Engagement analysis']
    },
    {
      title: 'Advanced Integration',
      description: 'Seamlessly connect with your favorite tools and platforms.',
      benefits: ['Multi-platform support', 'API access', 'Custom webhooks']
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="relative">
        <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center font-bold text-white">
            CT
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            clienttoo
          </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
          <Link href="#about" className="text-gray-300 hover:text-white transition-colors">About</Link>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Link href="/dashboard">Login</Link>
          </Button>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left relative z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent pb-2">
            Transform Your Instagram Presence
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl">
            Automate your Instagram engagement with AI-powered tools. Build genuine connections and grow your audience organically.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
               <Link href="/dashboard">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8">
              Start Free Trial
            </Button>
                  </Link>
            <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-950/50">
              Watch Demo
            </Button>
            </div>
          </div>
            <div className="relative mt-8 lg:mt-0">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 blur-3xl rounded-3xl" />
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-xl" />
              <img 
              src="/Ig-creators.png" 
              alt="Instagram Creators Dashboard"
              className="relative rounded-xl border border-slate-700/50 shadow-2xl w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent rounded-xl" />
            </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      </section>

      <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
        Powerful Features
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Everything you need to manage and grow your Instagram presence
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-blue-500/50 transition-all">
          <CardHeader>
            <CardTitle className="text-blue-400">{feature.title}</CardTitle>
            <CardDescription className="text-gray-400">{feature.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
            {feature.benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span className="text-gray-300">{benefit}</span>
              </li>
            ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20">
            Learn More
            </Button>
          </CardFooter>
          </Card>
        ))}
        </div>
      </div>
      </section>

    </main>
  )
}

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, ThumbsUp, ArrowRight } from 'lucide-react'
import Image from "next/image"
import { Input } from "@/components/ui/input"

export default function Home() {
  return (
   <main>
     <section className="min-h-[80vh] bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Logo
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="#resources" className="text-gray-600 hover:text-gray-900">
                Resources
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button>
                <Link href="/dashboard">Login</Link></Button>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <div className="py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transform Your Instagram Engagement Effortlessly
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Clienttoo revolutionizes how you connect with your audience on Instagram. Our platform automates responses and interactions, turning every engagement into a valuable opportunity.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">Get Started</Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Instant DM Responses to Boost Engagement
            </h2>
            <p className="text-gray-600 mb-6">
              Respond instantly to keywords in DMs. Clienttoo empowers your business with automated responses to direct messages and comments. Experience seamless interactions that convert engagement into valuable opportunities.
            </p>
            <Button variant="outline" className="flex items-center">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="relative aspect-video">
            <Image
              src="/placeholder.svg"
              alt="Feature illustration"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative aspect-video">
            <Image
              src="/placeholder.svg"
              alt="Feature illustration"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-6">
              Automated Comment Triggers for Effortless Interaction
            </h2>
            <p className="text-gray-600 mb-6">
              Set up automations that react to comments. Our system allows you to like and reply to comments automatically, ensuring consistent engagement with your audience.
            </p>
            <Button variant="outline" className="flex items-center">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/support">Support Center</Link></li>
              <li><Link href="/blog">Blog Posts</Link></li>
              <li><Link href="/faq">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/webinars">Webinars</Link></li>
              <li><Link href="/case-studies">Case Studies</Link></li>
              <li><Link href="/ebooks">E-books</Link></li>
              <li><Link href="/guides">Guides</Link></li>
              <li><Link href="/templates">Templates</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Stay Connected</h3>
            <ul className="space-y-2">
              <li><Link href="#">Instagram</Link></li>
              <li><Link href="#">Facebook</Link></li>
              <li><Link href="#">Twitter</Link></li>
              <li><Link href="#">LinkedIn</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Subscribe</h3>
            <p className="text-sm mb-4">
              Join our newsletter to stay updated on features and releases.
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700"
              />
              <Button className="w-full">Subscribe</Button>
            </div>
            <p className="text-xs mt-2 text-gray-400">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2024 Clienttoo. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookies Settings</Link>
          </div>
        </div>
      </div>
    </footer>
   </main>
  );
}

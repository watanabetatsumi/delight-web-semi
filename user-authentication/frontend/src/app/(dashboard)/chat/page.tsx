'use client';

import { MessageCircle, Users, Send, Zap, Shield, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ChatPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Real-time Chat
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect instantly with other community members through our upcoming chat feature.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <CardContent className="text-center py-12">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary-900 mb-4">
            Coming Soon!
          </h2>
          <p className="text-primary-700 mb-6 max-w-md mx-auto">
            We're building an amazing chat experience that will revolutionize how you connect with the community.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-800 text-sm font-medium">
            <Zap className="w-4 h-4 mr-2" />
            In Development
          </div>
        </CardContent>
      </Card>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Send className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Instant Messaging</CardTitle>
            <CardDescription>
              Send and receive messages in real-time with typing indicators and read receipts.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Group Conversations</CardTitle>
            <CardDescription>
              Create group chats with multiple users and manage conversations easily.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Online Status</CardTitle>
            <CardDescription>
              See who's online and available for chat with real-time presence indicators.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle>Privacy Controls</CardTitle>
            <CardDescription>
              Control who can message you and manage your privacy settings.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle>Rich Messages</CardTitle>
            <CardDescription>
              Share images, files, and formatted text with rich message support.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Get notified about new messages with customizable notification settings.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Technical Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
          <CardDescription>
            Here's what we're building behind the scenes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Frontend Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  WebSocket real-time communication
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  React-based chat interface
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Message history and search
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Responsive mobile design
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Backend Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Go WebSocket server
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  MySQL message storage
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  User presence tracking
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Message encryption
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gray-50">
        <CardContent className="text-center py-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Want to be notified when chat launches?
          </h3>
          <p className="text-gray-600 mb-6">
            We'll let you know as soon as the chat feature is ready for you to try.
          </p>
          <Button disabled>
            <MessageCircle className="w-4 h-4 mr-2" />
            Notify Me (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
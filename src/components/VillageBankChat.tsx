
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, Phone, Video, MoreVertical, Smile } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'message' | 'system';
}

interface VillageBankChatProps {
  groupId: string;
  groupName: string;
  onClose: () => void;
}

export const VillageBankChat = ({ groupId, groupName, onClose }: VillageBankChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'system',
      senderName: 'System',
      content: `Welcome to the ${groupName} chat!`,
      timestamp: '2024-01-15T10:00:00Z',
      type: 'system'
    },
    {
      id: '2',
      senderId: '1',
      senderName: 'John Banda',
      content: 'Hello everyone! Ready for this month\'s contributions?',
      timestamp: '2024-01-15T10:30:00Z',
      type: 'message'
    },
    {
      id: '3',
      senderId: '2',
      senderName: 'Mary Phiri',
      content: 'Yes! I\'ve already made my contribution. Looking forward to the returns!',
      timestamp: '2024-01-15T11:00:00Z',
      type: 'message'
    },
    {
      id: '4',
      senderId: 'current-user',
      senderName: 'You',
      content: 'Great! I\'ll contribute tomorrow morning.',
      timestamp: '2024-01-15T11:15:00Z',
      type: 'message'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md h-[600px] flex flex-col p-0">
        {/* WhatsApp-like Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-semibold">
              {groupName.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium text-white">{groupName}</h3>
              <p className="text-xs text-gray-400">12 members</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Messages Area */}
        <ScrollArea className="flex-1 bg-gray-900 bg-opacity-95" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}>
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${
                  message.type === 'system' 
                    ? 'bg-gray-700 text-center text-sm py-2 px-4 rounded-lg mx-auto' 
                    : message.senderId === 'current-user'
                    ? 'bg-green-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md'
                    : 'bg-gray-700 text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-md'
                } p-3 shadow-lg`}>
                  {message.type === 'message' && message.senderId !== 'current-user' && (
                    <div className="text-xs text-cyan-300 mb-1 font-medium">{message.senderName}</div>
                  )}
                  <div className="text-sm leading-relaxed">{message.content}</div>
                  <div className={`text-[10px] mt-1 flex justify-end ${
                    message.senderId === 'current-user' ? 'text-green-200' : 'text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                    {message.senderId === 'current-user' && (
                      <span className="ml-1">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Message Input Area */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
              <Smile className="w-5 h-5" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full px-4 py-2 focus:border-green-500"
            />
            <Button 
              onClick={handleSendMessage} 
              className={`rounded-full p-2 ${newMessage.trim() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600'}`}
              disabled={!newMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

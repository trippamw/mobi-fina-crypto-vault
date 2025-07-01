
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X } from 'lucide-react';

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
      content: 'Welcome to the Chilomoni Investment Group chat!',
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>{groupName} Chat</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'system' 
                    ? 'bg-gray-600 text-center w-full text-sm' 
                    : message.senderId === 'current-user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}>
                  {message.type === 'message' && message.senderId !== 'current-user' && (
                    <div className="text-xs text-gray-300 mb-1">{message.senderName}</div>
                  )}
                  <div>{message.content}</div>
                  <div className="text-xs text-gray-300 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

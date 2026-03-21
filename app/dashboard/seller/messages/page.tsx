"use client"
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { MessageSquare, MoreHorizontal, Plus, Search, Send } from 'lucide-react';
import React, { useState } from 'react'

const Page = () => {
 const [selectedChat, setSelectedChat] = useState<number | null>(0);
      const [chats] = useState([
          { id: 1, user: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', lastMsg: 'Is the tractor still available?', time: '10m', unread: 2 },
          { id: 2, user: 'Sarah Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', lastMsg: 'Thanks for the fast delivery!', time: '1d', unread: 0 },
          { id: 3, user: 'Mike Ross', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', lastMsg: 'Do you ship to Texas?', time: '2d', unread: 0 },
      ]);
      const [messages, setMessages] = useState([
          { id: 1, sender: 'them', text: 'Hi, I saw your listing for the Heavy Duty Tractor.', time: '10:30 AM' },
          { id: 2, sender: 'me', text: 'Hello! Yes, it is still available.', time: '10:32 AM' },
          { id: 3, sender: 'them', text: 'Is the price negotiable?', time: '10:33 AM' },
      ]);
      const [replyText, setReplyText] = useState('');

      const handleSend = () => {
          if (!replyText.trim()) return;
          setMessages([...messages, { id: Date.now(), sender: 'me', text: replyText, time: 'Just now' }]);
          setReplyText('');
      };

      return (
          <div className="h-[calc(100vh-140px)] animate-in fade-in duration-300 flex gap-6">
              {/* Chat List */}
              <Card className="w-1/3 flex flex-col h-full" noPadding>
                  <div className="p-4 border-b border-gray-100">
                      <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input type="text" placeholder="Search chats..." className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                      {chats.map((chat, i) => (
                          <div 
                            key={chat.id} 
                            onClick={() => setSelectedChat(i)}
                            className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-gray-50 hover:bg-gray-50 ${selectedChat === i ? 'bg-primary-50' : ''}`}
                          >
                              <div className="relative">
                                <img src={chat.avatar} className="w-12 h-12 rounded-full bg-gray-200" alt="" />
                                {chat.unread > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{chat.unread}</div>}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-baseline mb-1">
                                      <h4 className="font-bold text-gray-900 text-sm">{chat.user}</h4>
                                      <span className="text-xs text-gray-400">{chat.time}</span>
                                  </div>
                                  <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{chat.lastMsg}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </Card>

              {/* Chat Window */}
              <Card className="flex-1 flex flex-col h-full overflow-hidden" noPadding>
                  {selectedChat !== null ? (
                      <>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-3">
                                <img src={chats[selectedChat].avatar} className="w-10 h-10 rounded-full" alt="" />
                                <div>
                                    <h4 className="font-bold text-gray-900">{chats[selectedChat].user}</h4>
                                    <span className="text-xs text-green-600 flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Online</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm"><MoreHorizontal size={20}/></Button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                                        msg.sender === 'me' 
                                        ? 'bg-primary-600 text-white rounded-br-none' 
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}>
                                        <p>{msg.text}</p>
                                        <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-primary-100' : 'text-gray-400'}`}>{msg.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600"><Plus size={20}/></Button>
                                <input 
                                    type="text" 
                                    placeholder="Type a message..." 
                                    className="flex-1 bg-white border border-gray-200 rounded-full px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <Button size="sm" className="rounded-full w-10 h-10 p-0 flex items-center justify-center" onClick={handleSend}>
                                    <Send size={18} className="ml-0.5" />
                                </Button>
                            </div>
                        </div>
                      </>
                  ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                          <MessageSquare size={48} className="mb-4 opacity-50" />
                          <p>Select a conversation to start messaging</p>
                      </div>
                  )}
              </Card>
          </div>
      );
  };

  


export default Page
"use client";
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Users, MessageCircle, Heart, ArrowRight, Lock } from 'lucide-react';
import { MOCK_POSTS, MOCK_GROUPS } from '../constants';
import { Modal } from '@/components/Modal';
import { Group } from '../types';
import Image from 'next/image';
import {useRouter} from 'next/navigation'
 
interface LandingCommunityProps {
  onGetStarted: () => void;
}

export const Community: React.FC<LandingCommunityProps> = ({ onGetStarted }) => {
   const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Group Preview Modal */}
      <Modal
        isOpen={!!selectedGroup}
        onClose={() => setSelectedGroup(null)}
        title="Group Preview"
        size="md"
      >
        {selectedGroup && (
            <div className="space-y-6">
                <div className="aspect-video relative rounded-xl overflow-hidden">
                    <Image fill src={selectedGroup.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h2 className="text-3xl font-bold mb-2">{selectedGroup.name}</h2>
                            <p className="opacity-90">{selectedGroup.members.toLocaleString()} Members</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        {selectedGroup.type === 'paid' ? <Lock size={16} /> : <Users size={16} />}
                        <span className="uppercase font-bold tracking-wider">{selectedGroup.type} Group</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        {selectedGroup.description} Join this group to connect with like-minded farmers, share daily updates, ask for advice on pest control, and trade market insights.
                    </p>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-2">Why join?</h4>
                        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                            <li>Access to exclusive weekly webinars</li>
                            <li>Direct Q&A with industry experts</li>
                            <li>Community marketplace deals</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <Button 
                        fullWidth 
                        size="lg" 
                        onClick={() => {
                           router.push(`/auth/signup`);
                        }}
                    >
                        Join Group
                    </Button>
                </div>
            </div>
        )}
      </Modal>

      {/* Hero */}
      <div className="text-center py-20 px-4">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-6">
            <Users size={16} />
            <span>Join 50,000+ Farmers Worldwide</span>
         </div>
         <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Farming is Better <span className="text-blue-600">Together</span>
         </h1>
         <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Share knowledge, ask for advice, and celebrate harvests with a community that understands the soil just like you do.
         </p>
         <Button size="lg" className="rounded-full px-8 bg-blue-600 hover:bg-blue-700" onClick={onGetStarted}>
            Join the Conversation
         </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-24">
         
         {/* Live Discussions Preview */}
         <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <h2 className="text-3xl font-bold text-gray-900">Real conversations, <br/>Real time.</h2>
               <p className="text-gray-600 text-lg">
                  From pest control tips to market price discussions, our feed is buzzing with valuable insights from experienced farmers.
               </p>
               
               <div className="space-y-4">
                  {MOCK_POSTS.slice(0, 2).map(post => (
                     <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                           <Image fill src={post.author.avatar} className="w-10 h-10 rounded-full" alt="" />
                           <div>
                              <p className="font-bold text-gray-900">{post.author.name}</p>
                              <p className="text-xs text-gray-500">{post.author.role}</p>
                           </div>
                        </div>
                        <p className="text-gray-700 mb-4">{post.content}</p>
                        <div className="flex gap-4 text-gray-400 text-sm">
                           <span className="flex items-center gap-1"><Heart size={16}/> {post.likes}</span>
                           <span className="flex items-center gap-1"><MessageCircle size={16}/> {post.comments}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            
            <div className="relative">
               <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-green-100 rounded-full blur-3xl opacity-50"></div>
               <Image 
               fill 
                  src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1548&q=80" 
                  alt="Community mobile app" 
                  className="relative z-10 rounded-3xl shadow-2xl border-4 border-white mx-auto max-w-xs md:max-w-sm rotate-3 hover:rotate-0 transition-transform duration-500"
               />
            </div>
         </section>

         {/* Groups Section */}
         <section>
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-gray-900">Find Your Tribe</h2>
               <p className="text-gray-600 mt-4">Join specialized groups tailored to your interests.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
               {MOCK_GROUPS.map(group => (
                  <div 
                    key={group.id} 
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer" 
                    onClick={() => setSelectedGroup(group)}
                  >
                     <div className="h-40 relative">
                        <Image fill src={group.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                           <h3 className="font-bold text-xl drop-shadow-md">{group.name}</h3>
                           <p className="text-sm opacity-90">{group.members.toLocaleString()} members</p>
                        </div>
                     </div>
                     <div className="p-6">
                        <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                        <Button variant="outline" fullWidth className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 pointer-events-none">View Group</Button>
                     </div>
                  </div>
               ))}
               
               {/* Custom "More" Card */}
               <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={onGetStarted}>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                     <ArrowRight className="text-gray-400" />
                  </div>
                  <h3 className="font-bold text-gray-900">Discover 500+ Groups</h3>
                  <p className="text-sm text-gray-500 mt-2">Hydroponics, Cattle, Machinery, and more...</p>
               </div>
            </div>
         </section>

         {/* Experts CTA */}
         <section className="bg-blue-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
               <h2 className="text-3xl font-bold mb-6">Are you an expert in your field?</h2>
               <p className="text-blue-100 text-lg mb-8">
                  Share your knowledge, build a following, and even monetize your expertise by creating premium groups or courses.
               </p>
               <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-none" onClick={onGetStarted}>Become a Creator</Button>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>
         </section>

      </div>
    </div>
  );
};
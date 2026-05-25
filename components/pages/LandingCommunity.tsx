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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-mono text-xs text-zinc-900 bg-zinc-50 antialiased">
      
      {/* Group Preview Modal */}
      <Modal
        isOpen={!!selectedGroup}
        onClose={() => setSelectedGroup(null)}
        title="Group Preview"
        size="md"
      >
        {selectedGroup && (
            <div className="space-y-6 font-mono text-xs">
                <div className="aspect-video relative rounded-none border border-zinc-200 overflow-hidden bg-zinc-100">
                    <Image fill src={selectedGroup.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                            <h2 className="text-sm font-black uppercase tracking-wider mb-1.5">{selectedGroup.name}</h2>
                            <p className="text-[10px] tracking-wide font-bold uppercase text-zinc-300">{selectedGroup.members.toLocaleString()} Members</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4 font-sans text-zinc-650">
                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-500">
                        {selectedGroup.type === 'paid' ? <Lock size={14} className="text-red-650" /> : <Users size={14} className="text-green-700" />}
                        <span className="uppercase tracking-widest">{selectedGroup.type} Group</span>
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-700 font-sans">
                        {selectedGroup.description} Join this group to connect with like-minded farmers, share daily updates, ask for advice on pest control, and trade market insights.
                    </p>
                    
                    <div className="bg-green-50/50 p-4 border border-green-700/20 text-green-950 font-mono text-xs">
                        <h4 className="font-bold uppercase tracking-wider mb-2 text-green-800">Why join?</h4>
                        <ul className="list-none space-y-1.5 text-[11px] font-bold text-green-900 uppercase">
                            <li className="flex items-center gap-1.5">▪ Access to exclusive weekly webinars</li>
                            <li className="flex items-center gap-1.5">▪ Direct Q&A with industry experts</li>
                            <li className="flex items-center gap-1.5">▪ Community marketplace deals</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 font-mono">
                    <Button 
                        fullWidth 
                        size="lg" 
                        className="rounded-none uppercase font-bold tracking-wider text-xs"
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
      <div className="text-center py-20 px-4 max-w-4xl mx-auto">
         <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-green-700/30 bg-green-50 text-green-800 font-mono text-[10px] uppercase font-bold tracking-wider mb-6 rounded-none">
            <Users size={14} />
            <span>Join 50,000+ Farmers Worldwide</span>
         </div>
         <h1 className="text-3xl md:text-5xl font-black text-zinc-950 uppercase tracking-tight mb-4 font-mono">
            Farming is Better <span className="text-green-700 font-black">Together</span>
         </h1>
         <p className="text-xs text-zinc-500 font-sans max-w-xl mx-auto mb-8 leading-relaxed">
            Share knowledge, ask for advice, and celebrate harvests with a community that understands the soil just like you do.
         </p>
         <Button size="lg" className="rounded-none px-8 uppercase font-bold tracking-wider text-xs" onClick={onGetStarted}>
            Join the Conversation
         </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-24">
         
         {/* Live Discussions Preview */}
         <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <h2 className="text-xl font-black text-zinc-950 uppercase tracking-tight font-mono">Real conversations, <br/>Real time.</h2>
               <p className="text-zinc-500 font-sans text-xs leading-relaxed">
                  From pest control tips to market price discussions, our feed is buzzing with valuable insights from experienced farmers.
               </p>
               
               <div className="space-y-4">
                  {MOCK_POSTS.slice(0, 2).map(post => (
                     <div key={post.id} className="bg-white p-6 rounded-none border border-zinc-200 relative cursor-pointer hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="relative w-10 h-10 border border-zinc-200 rounded-none overflow-hidden bg-zinc-50 shrink-0">
                              <Image fill src={post.author.avatar} className="object-cover" alt="" />
                           </div>
                           <div>
                              <p className="font-bold font-mono text-zinc-950 text-xs uppercase tracking-wider leading-tight">{post.author.name}</p>
                              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide mt-0.5">{post.author.role}</p>
                           </div>
                        </div>
                        <p className="text-xs text-zinc-650 font-sans mb-4 leading-relaxed">{post.content}</p>
                        <div className="flex gap-4 text-zinc-400 text-[10px] font-mono uppercase tracking-wider font-bold">
                           <span className="flex items-center gap-1 hover:text-green-700 transition-colors"><Heart size={14}/> {post.likes}</span>
                           <span className="flex items-center gap-1 hover:text-green-700 transition-colors"><MessageCircle size={14}/> {post.comments}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            
            <div className="relative flex justify-center">
               <div className="relative z-10 rounded-none border border-zinc-200 bg-white p-2 mx-auto max-w-xs md:max-w-sm">
                  <Image 
                     width={384}
                     height={512}
                     src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1548&q=80" 
                     alt="Community mobile app" 
                     className="rounded-none object-cover"
                  />
               </div>
            </div>
         </section>

         {/* Groups Section */}
         <section>
            <div className="text-center mb-12">
               <h2 className="text-xl font-black text-zinc-950 uppercase tracking-tight font-mono">Find Your Tribe</h2>
               <p className="text-zinc-500 font-sans text-xs mt-1.5">Join specialized groups tailored to your interests.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
               {MOCK_GROUPS.map(group => (
                  <div 
                    key={group.id} 
                    className="bg-white rounded-none border border-zinc-200 overflow-hidden hover:bg-zinc-50 transition-colors group cursor-pointer flex flex-col justify-between" 
                    onClick={() => setSelectedGroup(group)}
                  >
                     <div>
                        <div className="h-40 relative border-b border-zinc-200 bg-zinc-100">
                           <Image fill src={group.image} className="w-full h-full object-cover" alt="" />
                           <div className="absolute inset-0 bg-black/30"></div>
                           <div className="absolute bottom-4 left-4 text-white">
                              <h3 className="font-mono text-xs uppercase font-bold tracking-widest leading-tight mb-0.5">{group.name}</h3>
                              <p className="text-[10px] opacity-80 uppercase tracking-wider font-bold">{group.members.toLocaleString()} members</p>
                           </div>
                        </div>
                        <div className="p-6">
                           <p className="text-zinc-500 font-sans text-xs mb-4 leading-relaxed">{group.description}</p>
                        </div>
                     </div>
                     <div className="px-6 pb-6">
                        <Button variant="outline" fullWidth className="rounded-none font-mono uppercase font-bold tracking-wider text-xs pointer-events-none group-hover:bg-green-700 group-hover:text-white group-hover:border-green-700">View Group</Button>
                     </div>
                  </div>
               ))}
               
               {/* Custom "More" Card */}
               <div className="bg-zinc-50 rounded-none border border-dashed border-zinc-300 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-zinc-100/50 transition-colors" onClick={onGetStarted}>
                  <div className="w-12 h-12 bg-white border border-zinc-200 flex items-center justify-center mb-4 rounded-none">
                     <ArrowRight className="text-zinc-500" size={16} />
                  </div>
                  <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-950">Discover 500+ Groups</h3>
                  <p className="text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-wide">Hydroponics, Cattle, Machinery, and more...</p>
               </div>
            </div>
         </section>

         {/* Experts CTA */}
         <section className="bg-zinc-950 border border-zinc-800 p-8 md:p-12 text-center text-zinc-300 relative overflow-hidden rounded-none">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
               <h2 className="text-lg font-mono uppercase font-bold tracking-widest text-white">Are you an expert in your field?</h2>
               <p className="text-zinc-400 font-sans text-xs leading-relaxed max-w-lg mx-auto">
                  Share your knowledge, build a following, and even monetize your expertise by creating premium groups or courses.
               </p>
               <Button size="lg" className="bg-green-700 text-white hover:bg-green-800 rounded-none font-mono text-xs uppercase font-bold tracking-wider px-6 border-none" onClick={onGetStarted}>Become a Creator</Button>
            </div>
         </section>

      </div>
    </div>
  );
};
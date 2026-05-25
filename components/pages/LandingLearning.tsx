"use client";
import React, { useState, useEffect, useCallback } from 'react';
import {
   BookOpen, PlayCircle, Award, CheckCircle, Star,
   ArrowRight, Loader2, Sparkles, Filter
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '../Button';
import { Card } from '../Card';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';

export const Learning = () => {
   const fetcher = useApi();
   const router = useRouter();
   const [courses, setCourses] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   const fetchCourses = useCallback(async () => {
      setLoading(true);
      try {
         const res = await fetcher('/api/products?type=digital');
         setCourses(res.data || []);
      } catch (e) {
         console.error("Failed to fetch courses", e);
      } finally {
         setLoading(false);
      }
   }, [fetcher]);

   useEffect(() => {
      fetchCourses();
   }, [fetchCourses]);

   return (
      <div className="animate-in fade-in duration-700 bg-zinc-50 min-h-screen text-zinc-900 font-mono text-xs antialiased">
         {/* Hero Section */}
         <div className="relative bg-zinc-950 text-white overflow-hidden border-b border-zinc-800">
            <div className="absolute inset-0">
               <Image
                  fill
                  src="https://images.unsplash.com/photo-1615811361524-78849b2c900e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
                  alt="Learning"
                  className="w-full h-full object-cover opacity-5 blur-[2px]"
                  unoptimized
               />
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
               <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-green-700/30 bg-green-950/40 text-green-400 font-mono text-[10px] uppercase font-bold tracking-wider mb-8 rounded-none">
                  <Sparkles size={12} className="animate-pulse text-green-400" /> Bleefy Academy
               </div>
               <h1 className="text-3xl md:text-5xl font-black leading-[1.1] tracking-tight max-w-4xl mb-6 font-mono uppercase text-white">
                  Cultivate Your Knowledge <br />
                  <span className="text-green-400 font-black">Direct From Experts.</span>
               </h1>
               <p className="text-xs text-zinc-400 max-w-xl mx-auto font-sans leading-relaxed mb-8">
                  Join thousands of Nigerian farmers mastering precision agriculture, livestock management, and agribusiness through our verified expert guides.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button
                     size="lg"
                     className="h-12 px-8 rounded-none bg-green-700 hover:bg-green-800 text-white font-mono text-xs uppercase font-bold tracking-wider border-none"
                     onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                     Start Learning Now
                  </Button>
                  <Button
                     size="lg"
                     variant="outline"
                     className="h-12 px-8 rounded-none text-white border-zinc-700 hover:bg-zinc-800 font-mono text-xs uppercase font-bold tracking-wider bg-transparent"
                     onClick={() => router.push('/dashboard/seller/payouts')} // Mock redirect to seller area for teaching
                  >
                     Become an Instructor
                  </Button>
               </div>
            </div>
         </div>

         {/* Features Grid */}
         <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
            <div className="grid md:grid-cols-3 gap-6">
               {[
                  { title: 'Verified Experts', desc: 'Content created by university-certified agronomists.', icon: Award, color: 'text-zinc-800 bg-zinc-100 border-zinc-200' },
                  { title: 'Interactive Content', desc: 'HD video lessons, downloadable guides, and quizzes.', icon: PlayCircle, color: 'text-green-700 bg-green-50 border-green-700/20' },
                  { title: 'Lifetime Access', desc: 'Learn at your own pace with unlimited content access.', icon: CheckCircle, color: 'text-zinc-800 bg-zinc-100 border-zinc-200' }
               ].map((feature, i) => (
                  <Card key={i} className="p-8 border border-zinc-200 shadow-none rounded-none bg-white font-mono text-xs">
                     <div className={`w-12 h-12 border flex items-center justify-center mb-6 rounded-none ${feature.color}`}>
                        <feature.icon size={20} />
                     </div>
                     <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-3">{feature.title}</h3>
                     <p className="text-zinc-500 text-xs leading-relaxed font-sans">{feature.desc}</p>
                  </Card>
               ))}
            </div>
         </div>

         {/* Catalog Section */}
         <div id="catalog" className="max-w-7xl mx-auto px-6 py-24 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-200 pb-6">
               <div>
                  <h2 className="text-xl font-black text-zinc-950 uppercase tracking-tight font-mono">Expert Course Catalog</h2>
                  <p className="text-zinc-500 font-sans text-xs mt-1.5">Filter through hundreds of specialized agricultural modules.</p>
               </div>
               <div className="flex items-center gap-2 bg-zinc-100 p-1 border border-zinc-200 rounded-none font-mono text-[10px]">
                  <button className="px-4 py-2 bg-white text-green-700 border border-zinc-200 rounded-none uppercase font-bold tracking-wider cursor-pointer">All Categories</button>
                  <button className="px-4 py-2 text-zinc-500 hover:text-zinc-950 rounded-none uppercase font-bold tracking-wider cursor-pointer">Livestock</button>
                  <button className="px-4 py-2 text-zinc-500 hover:text-zinc-950 rounded-none uppercase font-bold tracking-wider cursor-pointer">Crops</button>
                  <div className="w-px h-6 bg-zinc-200 mx-1" />
                  <button className="p-2 text-zinc-500 hover:text-green-700 cursor-pointer">
                     <Filter size={14} />
                  </button>
               </div>
            </div>

            {loading ? (
               <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-green-700" size={32} />
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Loading Academy...</p>
               </div>
            ) : courses.length === 0 ? (
               <div className="py-20 text-center bg-white rounded-none border border-dashed border-zinc-300">
                  <BookOpen size={40} className="mx-auto text-zinc-300 mb-4" />
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-450">No courses available in this category yet.</p>
               </div>
            ) : (
               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courses.map(course => (
                     <Card
                        key={course.id}
                        noPadding
                        onClick={() => router.push(`/learning/${course.id}`)}
                        className="group cursor-pointer border border-zinc-200 shadow-none hover:bg-zinc-50/50 transition-colors duration-300 rounded-none overflow-hidden bg-white flex flex-col justify-between"
                     >
                        <div className="aspect-[4/3] relative overflow-hidden border-b border-zinc-200 bg-zinc-50">
                           <Image fill src={course.primaryImage} className="w-full h-full object-cover" alt={course.title} unoptimized />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                              <span className="text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                                 View Curriculum <ArrowRight size={12} />
                              </span>
                           </div>
                           <div className="absolute top-4 right-4 bg-white/95 border border-zinc-200 px-2 py-1 flex items-center gap-1 text-yellow-600 font-mono font-bold text-[10px] uppercase rounded-none shadow-none">
                              <Star size={12} fill="currentColor" /> {course.digitalMetadata?.trustScore || '4.8'}
                           </div>
                        </div>
                        <div className="p-8">
                           <div className="flex items-center gap-2 mb-3">
                              <span className="text-[9px] font-bold text-green-700 bg-green-50 border border-green-700/20 px-2 py-0.5 uppercase tracking-wider rounded-none font-mono">
                                 {course.category?.name || 'Agri-Tech'}
                              </span>
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">{course.digitalMetadata?.aiAccuracyScore || 90}% AI Accuracy</span>
                           </div>
                           <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-950 mb-4 line-clamp-2 leading-tight group-hover:text-green-700 transition-colors">{course.title}</h3>

                           <div className="flex items-center justify-between pt-6 border-t border-zinc-150">
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Enrollment Fee</span>
                                 <span className="font-mono font-bold text-base text-zinc-950 tracking-wider">₦{Number(course.price).toLocaleString()}</span>
                              </div>
                              <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 text-zinc-700 flex items-center justify-center group-hover:border-green-700 group-hover:bg-green-50 group-hover:text-green-700 transition-colors rounded-none shadow-none">
                                 <PlayCircle size={20} />
                              </div>
                           </div>
                        </div>
                     </Card>
                  ))}
               </div>
            )}
         </div>

         {/* Newsletter / CTA */}
         <div className="max-w-7xl mx-auto px-6 pb-24">
            <Card className="bg-zinc-950 border border-zinc-800 p-12 md:p-16 text-center text-zinc-300 relative overflow-hidden rounded-none shadow-none font-mono text-xs">
               <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                  <h2 className="text-lg font-mono uppercase font-bold tracking-widest text-white">Ready to stay ahead?</h2>
                  <p className="text-zinc-400 font-sans text-xs leading-relaxed max-w-lg mx-auto">Join our exclusive newsletter to get 15% off your first course and weekly agri-market insights.</p>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                     <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 h-12 bg-zinc-900 border border-zinc-800 text-white px-4 rounded-none font-mono text-xs focus:outline-none focus:border-green-700 placeholder:text-zinc-550"
                     />
                     <Button className="h-12 px-8 bg-green-700 hover:bg-green-800 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-none border-none">
                        Subscribe
                     </Button>
                  </div>
               </div>
            </Card>
         </div>
      </div>
   );
};
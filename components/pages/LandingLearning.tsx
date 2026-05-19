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
    <div className="animate-in fade-in duration-700 bg-white min-h-screen">
       {/* Hero Section */}
       <div className="relative bg-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0">
             <Image 
               fill
               src="https://images.unsplash.com/photo-1615811361524-78849b2c900e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80" 
               alt="Learning" 
               className="w-full h-full object-cover opacity-10 blur-[2px]"
               unoptimized
             />
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-40 flex flex-col items-center text-center">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Sparkles size={14} className="animate-pulse" /> AgriMarket Academy
             </div>
             <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight max-w-4xl mb-8">
                Cultivate Your Knowledge <br /> 
                <span className="text-emerald-400">Direct From Experts.</span>
             </h1>
             <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-medium leading-relaxed mb-12">
                Join thousands of Nigerian farmers mastering precision agriculture, livestock management, and agribusiness through our verified expert guides.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button 
                    size="lg" 
                    className="h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-900/40"
                    onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                >
                   Start Learning Now
                </Button>
                <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-16 px-10 rounded-2xl text-white border-white/20 hover:bg-white/5 font-black uppercase tracking-widest text-sm"
                    onClick={() => router.push('/dashboard/seller/payouts')} // Mock redirect to seller area for teaching
                >
                   Become an Instructor
                </Button>
             </div>
          </div>
       </div>

       {/* Features Grid */}
       <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
          <div className="grid md:grid-cols-3 gap-6">
             {[
                { title: 'Verified Experts', desc: 'Content created by university-certified agronomists.', icon: Award, color: 'text-blue-500 bg-blue-50' },
                { title: 'Interactive Content', desc: 'HD video lessons, downloadable guides, and quizzes.', icon: PlayCircle, color: 'text-emerald-500 bg-emerald-50' },
                { title: 'Lifetime Access', desc: 'Learn at your own pace with unlimited content access.', icon: CheckCircle, color: 'text-orange-500 bg-orange-50' }
             ].map((feature, i) => (
                <Card key={i} className="p-8 border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-white">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                      <feature.icon size={28} />
                   </div>
                   <h3 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h3>
                   <p className="text-gray-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
                </Card>
             ))}
          </div>
       </div>

       {/* Catalog Section */}
       <div id="catalog" className="max-w-7xl mx-auto px-6 py-24 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
             <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Expert Course Catalog</h2>
                <p className="text-gray-500 font-medium mt-2">Filter through hundreds of specialized agricultural modules.</p>
             </div>
             <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                <button className="px-6 py-2.5 bg-white text-emerald-700 shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest">All Categories</button>
                <button className="px-6 py-2.5 text-gray-400 hover:text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Livestock</button>
                <button className="px-6 py-2.5 text-gray-400 hover:text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Crops</button>
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <button className="p-2.5 text-gray-400 hover:text-emerald-600">
                   <Filter size={18} />
                </button>
             </div>
          </div>

          {loading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Academy...</p>
             </div>
          ) : courses.length === 0 ? (
             <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <BookOpen size={64} className="mx-auto text-gray-200 mb-4" />
                <p className="text-xl font-bold text-gray-400">No courses available in this category yet.</p>
             </div>
          ) : (
             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {courses.map(course => (
                   <Card 
                     key={course.id} 
                     noPadding 
                     onClick={() => router.push(`/learning/${course.id}`)}
                     className="group cursor-pointer border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white"
                   >
                      <div className="aspect-[4/3] relative overflow-hidden">
                         <Image fill src={course.primaryImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} unoptimized />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                            <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                               View Curriculum <ArrowRight size={14} />
                            </span>
                         </div>
                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-yellow-500 font-black text-xs shadow-xl">
                            <Star size={14} fill="currentColor" /> {course.digitalMetadata?.trustScore || '4.8'}
                         </div>
                      </div>
                      <div className="p-8">
                         <div className="flex items-center gap-2 mb-3">
                             <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                                {course.category?.name || 'Agri-Tech'}
                             </span>
                             <span className="text-[10px] font-bold text-gray-400 uppercase">{course.digitalMetadata?.aiAccuracyScore || 90}% AI Accuracy</span>
                         </div>
                         <h3 className="font-black text-xl text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">{course.title}</h3>
                         
                         <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Enrollment Fee</span>
                               <span className="font-black text-2xl text-gray-900 tracking-tighter">₦{Number(course.price).toLocaleString()}</span>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center group-hover:bg-emerald-600 transition-colors shadow-lg">
                               <PlayCircle size={24} />
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
           <Card className="bg-emerald-600 p-12 md:p-20 rounded-[4rem] text-center text-white relative overflow-hidden border-none">
              <div className="absolute top-0 right-0 p-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 p-32 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                 <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Ready to scale your farm?</h2>
                 <p className="text-emerald-100 font-medium text-lg">Join our exclusive newsletter to get 15% off your first course and weekly agri-market insights.</p>
                 <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className="flex-1 h-16 rounded-2xl bg-white/10 border border-white/20 px-6 focus:outline-none focus:bg-white/20 transition-all placeholder:text-emerald-100/50 font-bold"
                    />
                    <Button className="h-16 px-10 rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 font-black uppercase tracking-widest text-sm border-none shadow-xl">
                        Subscribe
                    </Button>
                 </div>
              </div>
           </Card>
       </div>
    </div>
  );
};
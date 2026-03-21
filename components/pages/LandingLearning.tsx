"use client";
import React, { useState } from 'react';

import { BookOpen, PlayCircle, Award, CheckCircle, Star } from 'lucide-react';

 
import { Modal } from '../Modal';
import Image from 'next/image';
import { Button } from '../Button';
import { MOCK_COURSES } from '../constants';
import { Card } from '../Card';
import { Course, PendingAction } from '../types';

interface LandingLearningProps {
  onGetStarted: () => void;
  onAction: (action: PendingAction) => void;
}

export const Learning: React.FC<LandingLearningProps> = ({ onGetStarted, onAction }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       
       <Modal
         isOpen={!!selectedCourse}
         onClose={() => setSelectedCourse(null)}
         title="Course Preview"
         size="lg"
       >
         {selectedCourse && (
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                    <Image fill src={selectedCourse.image} className="w-full rounded-lg shadow-sm mb-4" alt="" />
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-center">
                        <span className="block text-3xl font-bold text-gray-900 mb-2">${selectedCourse.price}</span>
                        <Button
                            fullWidth 
                            className="bg-orange-600 hover:bg-orange-700" 
                            onClick={() => {
                                setSelectedCourse(null);
                                onAction({ type: 'enroll', data: selectedCourse });
                            }}
                        >
                            Enroll Now
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">30-day money-back guarantee</p>
                    </div>
                </div>
                <div className="md:w-2/3 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
                    <p className="text-gray-600">Created by <span className="font-bold text-orange-600">{selectedCourse.creator}</span></p>
                    
                    <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1 text-yellow-500 font-bold"><Star size={16} fill="currentColor"/> {selectedCourse.rating}</span>
                        <span className="text-gray-500">{selectedCourse.students.toLocaleString()} students</span>
                        <span className="text-gray-500">Last updated Sept 2023</span>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h3 className="font-bold text-gray-900">What you&apos;ll learn</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                             <div className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5" /> Soil management mastery</div>
                             <div className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5" /> Sustainable pest control</div>
                             <div className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5" /> Irrigation efficiency</div>
                             <div className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5" /> Maximizing crop yield</div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <h3 className="font-bold text-gray-900 mb-2">Course Content</h3>
                        <div className="space-y-2 text-sm">
                             {['Introduction to Sustainable Farming', 'Understanding Soil pH', 'Water Conservation Techniques', 'Organic Certification Process'].map((lesson, i) => (
                                 <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                                     <div className="flex items-center gap-3">
                                         <PlayCircle size={16} className="text-gray-400" />
                                         <span>{lesson}</span>
                                     </div>
                                     <span className="text-xs text-gray-400">12:30</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
         )}
       </Modal>

       {/* Hero */}
       <div className="relative bg-gray-900 text-white overflow-hidden mb-20">
          <div className="absolute inset-0">
             <Image 
             fill
               src="https://images.unsplash.com/photo-1615811361524-78849b2c900e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80" 
               alt="Learning" 
               className="w-full h-full object-cover opacity-20"
             />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
             <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-sm font-bold uppercase tracking-wider">
                   <BookOpen size={14} /> AgriMarket Academy
                </div>
                <h1 className="text-5xl font-bold leading-tight">Master Modern Farming Techniques</h1>
                <p className="text-xl text-gray-300">Access hundreds of expert-led courses on sustainable agriculture, livestock management, and agribusiness.</p>
                <div className="flex gap-4">
                   <Button size="lg" className="bg-orange-600 hover:bg-orange-700" onClick={onGetStarted}>Explore Courses</Button>
                   <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" onClick={onGetStarted}>Teach on AgriMarket</Button>
                </div>
             </div>
             
             {/* Stats Card */}
             <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl min-w-75">
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white">
                         <PlayCircle size={24} />
                      </div>
                      <div>
                         <p className="text-3xl font-bold">1,200+</p>
                         <p className="text-gray-400 text-sm">Video Courses</p>
                      </div>
                   </div>
                   <div className="h-px bg-white/10"></div>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                         <Award size={24} />
                      </div>
                      <div>
                         <p className="text-3xl font-bold">50k+</p>
                         <p className="text-gray-400 text-sm">Certificates Issued</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-20">
          
          {/* Features */}
          <section className="grid md:grid-cols-3 gap-8">
             {[
                { title: 'Expert Instructors', desc: 'Learn from university professors and veteran farmers.', icon: <Award size={32} /> },
                { title: 'Flexible Learning', desc: 'Watch lessons anytime, anywhere on any device.', icon: <PlayCircle size={32} /> },
                { title: 'Practical Skills', desc: 'Curriculum designed for real-world application.', icon: <CheckCircle size={32} /> }
             ].map((feature, i) => (
                <div key={i} className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
                   <div className="text-orange-600 mb-4">{feature.icon}</div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                   <p className="text-gray-600">{feature.desc}</p>
                </div>
             ))}
          </section>

          {/* Popular Courses */}
          <section>
             <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Popular Courses</h2>
                <Button variant="ghost" className="text-orange-600" onClick={onGetStarted}>View All</Button>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_COURSES.map(course => (
                   <Card key={course.id} noPadding onClick={() => setSelectedCourse(course)} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative">
                         <Image fill src={course.image} className="w-full h-full object-cover" alt="" />
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                               <PlayCircle size={32} />
                            </div>
                         </div>
                      </div>
                      <div className="p-5">
                         <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                         <p className="text-sm text-gray-500 mb-4">by {course.creator}</p>
                         
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                               <Star size={16} className="fill-current" /> {course.rating}
                            </div>
                            <span className="font-bold text-xl text-gray-900">${course.price}</span>
                         </div>
                      </div>
                   </Card>
                ))}
             </div>
          </section>
          
       </div>
    </div>
  );
};
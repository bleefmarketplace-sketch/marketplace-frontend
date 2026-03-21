"use client"
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useBuyer } from '@/context/BuyerContext';
import { ArrowLeft, MapPin, ShieldCheck, Star } from 'lucide-react';
import { useRouter } from 'next/router';
import React from 'react'

const Page = () => {
    const router = useRouter();

    const {setSearchQuery} = useBuyer();

    const vendors = [
        { name: 'GreenEarth Co.', rating: 4.9, products: 24, location: 'Iowa, USA', verified: true },
        { name: 'Happy Farms', rating: 4.8, products: 12, location: 'Wisconsin, USA', verified: true },
        { name: 'AgriMachinery Ltd.', rating: 4.5, products: 8, location: 'Texas, USA', verified: true },
        { name: 'SeedGen', rating: 4.7, products: 45, location: 'Nebraska, USA', verified: true },
        { name: 'Organic Valley', rating: 4.6, products: 18, location: 'California, USA', verified: true },
        { name: 'Midwest Tools', rating: 4.4, products: 30, location: 'Ohio, USA', verified: false },
    ];
     

  return (
     <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/buyer/marketplace')}>
                    <ArrowLeft size={20} />
                </Button>
                <h1 className="text-2xl font-bold">All Vendors</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor, i) => (
                    <Card key={i} className="hover:border-primary-500 transition-all cursor-pointer">
                        <div className="flex items-center gap-4 mb-4">
                             <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500 border border-gray-200">
                                 {vendor.name.charAt(0)}
                             </div>
                             <div>
                                 <h3 className="font-bold text-lg text-gray-900 flex items-center gap-1">
                                     {vendor.name} 
                                     {vendor.verified && <ShieldCheck size={18} className="text-blue-500" />}
                                 </h3>
                                 <p className="text-sm text-gray-500 flex items-center gap-1">
                                     <MapPin size={14} /> {vendor.location}
                                 </p>
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                             <div className="text-center">
                                 <p className="text-lg font-bold text-gray-900">{vendor.products}</p>
                                 <p className="text-xs text-gray-500">Products</p>
                             </div>
                             <div className="text-center border-l border-gray-100">
                                 <p className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                                     {vendor.rating} <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                 </p>
                                 <p className="text-xs text-gray-500">Rating</p>
                             </div>
                        </div>
                        <Button fullWidth variant="secondary" className="mt-4" onClick={() => {
                            setSearchQuery(vendor.name);
                            router.push('/dashboard/buyer/marketplace');
                        }}>View Products</Button>
                    </Card>
                ))}
            </div>
        </div>
  )
}

export default Page
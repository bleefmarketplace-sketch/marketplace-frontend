"use client"
import React, { useState } from 'react'
import { Modal } from '../Modal';
import { ActivityIcon, CheckCircle, FileText, ImageIcon, Store, XCircle } from 'lucide-react';
import { Button } from '../Button';

const MOCK_CONTENT_REVIEWS = [
    { id: 'CR-001', title: 'Organic Pesticide Mastery', type: 'Course', creator: 'AgriTeach', status: 'Pending', submitted: '2 hours ago', description: 'A comprehensive guide to natural pest control methods.' },
    { id: 'CR-002', title: 'Used Harvester 2015', type: 'Product', creator: 'FarmBoy99', status: 'Pending', submitted: '5 hours ago', description: 'Heavy duty harvester, slightly used. Needs new tires.' },
    { id: 'CR-003', title: 'Community Guidelines', type: 'Post', creator: 'System', status: 'Approved', submitted: '1 day ago', description: 'Updated rules for the main discussion board.' },
];

const PreviewModal = () => {
     const [previewContent, setPreviewContent] = useState<any>(null);
      const [contentReviews, setContentReviews] = useState(MOCK_CONTENT_REVIEWS);

     const handleContentReview = (id: string, action: 'Approve' | 'Reject') => {
        setContentReviews(prev => prev.filter(c => c.id !== id)); // Remove from pending
        // In a real app, send API request here
    };
  return (
 
        <Modal 
            isOpen={!!previewContent} 
            onClose={() => setPreviewContent(null)} 
            title={`Review ${previewContent?.type}`}
            size="md"
        >
            {previewContent && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className={`p-3 rounded-lg ${
                             previewContent.type === 'Course' ? 'bg-orange-100 text-orange-600' :
                             previewContent.type === 'Product' ? 'bg-green-100 text-green-600' :
                             'bg-blue-100 text-blue-600'
                        }`}>
                             {previewContent.type === 'Course' ? <ActivityIcon size={24}     /> :
                              previewContent.type === 'Product' ? <Store size={24} /> :
                              <FileText size={24} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{previewContent.title}</h3>
                            <p className="text-sm text-gray-500">Submitted by <span className="font-medium text-gray-900">{previewContent.creator}</span> • {previewContent.submitted}</p>
                        </div>
                    </div>

                    <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Content Media Preview</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">Description</h4>
                        <div className="p-4 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white">
                            {previewContent.description}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 p-3 border border-gray-200 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Automated Check</p>
                            <p className="text-sm font-medium text-green-600 flex items-center gap-1"><CheckCircle size={14}/> No Flagged Keywords</p>
                        </div>
                        <div className="flex-1 p-3 border border-gray-200 rounded-lg">
                             <p className="text-xs text-gray-500 uppercase font-bold mb-1">Risk Score</p>
                             <p className="text-sm font-medium text-blue-600">Low (12/100)</p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-gray-100">
                         <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => { handleContentReview(previewContent.id, 'Approve'); setPreviewContent(null); }}>
                             <CheckCircle size={18} className="mr-2"/> Approve
                         </Button>
                         <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => { handleContentReview(previewContent.id, 'Reject'); setPreviewContent(null); }}>
                             <XCircle size={18} className="mr-2"/> Reject
                         </Button>
                    </div>
                </div>
            )}
        </Modal>
  
  )
}

export default PreviewModal
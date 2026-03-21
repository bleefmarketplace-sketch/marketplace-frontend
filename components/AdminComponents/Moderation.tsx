import React, { useState } from 'react'
import { Card } from '../Card';
import { Activity, CheckCircle, Eye, FileText, Store, XCircle } from 'lucide-react';
import { Button } from '../Button';

const MOCK_CONTENT_REVIEWS = [
    { id: 'CR-001', title: 'Organic Pesticide Mastery', type: 'Course', creator: 'AgriTeach', status: 'Pending', submitted: '2 hours ago', description: 'A comprehensive guide to natural pest control methods.' },
    { id: 'CR-002', title: 'Used Harvester 2015', type: 'Product', creator: 'FarmBoy99', status: 'Pending', submitted: '5 hours ago', description: 'Heavy duty harvester, slightly used. Needs new tires.' },
    { id: 'CR-003', title: 'Community Guidelines', type: 'Post', creator: 'System', status: 'Approved', submitted: '1 day ago', description: 'Updated rules for the main discussion board.' },
];


const Moderation = () => {
    const [contentReviews, setContentReviews] = useState(MOCK_CONTENT_REVIEWS);
    const [previewContent, setPreviewContent] = useState<any>(null);
    const handleContentReview = (id: string, action: 'Approve' | 'Reject') => {
        setContentReviews(prev => prev.filter(c => c.id !== id)); // Remove from pending
        // In a real app, send API request here
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Content Moderation</h2>
                    <p className="text-gray-500">Review pending products, courses, and posts.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button className="px-3 py-1 bg-white shadow-sm text-sm font-bold rounded-md">Pending</button>
                    <button className="px-3 py-1 text-gray-500 text-sm font-medium hover:text-gray-900">Approved</button>
                    <button className="px-3 py-1 text-gray-500 text-sm font-medium hover:text-gray-900">Rejected</button>
                </div>
            </div>

            <div className="grid gap-4">
                {contentReviews.map(item => (
                    <Card key={item.id} className="flex justify-between items-center p-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${item.type === 'Course' ? 'bg-orange-100 text-orange-600' :
                                    item.type === 'Product' ? 'bg-green-100 text-green-600' :
                                        'bg-blue-100 text-blue-600'
                                }`}>
                                {item.type === 'Course' ? <Activity size={20} /> :
                                    item.type === 'Product' ? <Store size={20} /> :
                                        <FileText size={20} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{item.title}</h4>
                                <div className="flex gap-2 text-xs text-gray-500">
                                    <span>{item.type}</span>
                                    <span>•</span>
                                    <span>by {item.creator}</span>
                                    <span>•</span>
                                    <span>{item.submitted}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="text-gray-500 border-gray-200" onClick={() => setPreviewContent(item)}>
                                <Eye size={16} className="mr-2" /> Preview
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700" size="sm" onClick={() => handleContentReview(item.id, 'Approve')}>
                                <CheckCircle size={16} className="mr-2" /> Approve
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleContentReview(item.id, 'Reject')}>
                                <XCircle size={16} className="mr-2" /> Reject
                            </Button>
                        </div>
                    </Card>
                ))}
                {contentReviews.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No pending content to review.</div>
                )}
            </div>
        </div>
    )
}

export default Moderation
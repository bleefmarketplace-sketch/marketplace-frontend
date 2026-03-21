import React from 'react'
import { Modal } from '../Modal';
import { Truck } from 'lucide-react';
import { Button } from '../Button';

const TrackingModal = ({ orderId, onClose }: { orderId: string, onClose: () => void }) => (
    <Modal isOpen={!!orderId} onClose={onClose} title={`Tracking Order #${orderId}`} size="md">
        <div className="space-y-8 p-4">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <Truck className="text-primary-600" size={32} />
                <div>
                    <p className="font-bold text-gray-900">Estimated Delivery</p>
                    <p className="text-sm text-gray-500">Tomorrow, by 8:00 PM</p>
                </div>
            </div>

            <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {[
                    { status: 'Out for Delivery', time: 'Today, 8:30 AM', active: true },
                    { status: 'Arrived at Local Facility', time: 'Today, 6:00 AM', active: true },
                    { status: 'Shipped from Warehouse', time: 'Yesterday, 4:20 PM', active: true },
                    { status: 'Order Placed', time: 'Oct 24, 2:00 PM', active: true },
                ].map((step, i) => (
                    <div key={i} className="relative">
                        <div className={`absolute -left-8 w-6 h-6 rounded-full border-4 flex items-center justify-center ${step.active ? 'border-primary-100 bg-primary-600' : 'border-white bg-gray-300'}`}>
                            {i === 0 && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                        </div>
                        <div>
                            <p className={`font-bold text-sm ${i === 0 ? 'text-primary-600' : 'text-gray-900'}`}>{step.status}</p>
                            <p className="text-xs text-gray-500">{step.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Button fullWidth onClick={onClose}>Close Tracking</Button>
        </div>
    </Modal>
);

export default TrackingModal
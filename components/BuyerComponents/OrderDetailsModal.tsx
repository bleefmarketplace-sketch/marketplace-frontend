import React from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { CreditCard, MapPin } from 'lucide-react';
import Image from 'next/image';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string; // Changed to string to match your useState<string | null>
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface OrderDetailsModalProps {
  selectedOrder: Order | null;
  // This type matches a standard useState setter for string | null
  setSelectedOrder: (order: Order | null) => void;
  setShowTracking: (orderId: string | null) => void; 
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  selectedOrder, 
  setSelectedOrder, 
  setShowTracking 
}) => {
  return (
    <Modal 
      isOpen={!!selectedOrder} 
      onClose={() => setSelectedOrder(null)} 
      title="Order Details" 
      size="lg"
    >
      {selectedOrder && (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div>
              <p className="text-sm text-gray-500">
                Order ID: <span className="font-mono text-gray-900 font-bold">#{selectedOrder.id}</span>
              </p>
              <p className="text-sm text-gray-500">Placed on {selectedOrder.date}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => {}}>
                Download Invoice
              </Button>
              {selectedOrder.status !== 'Cancelled' && (
                <Button 
                  size="sm" 
                  onClick={() => { 
                    // 1. Set the tracking ID in the parent state
                    setShowTracking(selectedOrder.id);
                    // 2. Close this modal
                    setSelectedOrder(null); 
                  }}
                >
                  Track Order
                </Button>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={16} /> Shipping Address
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600">
                <p className="font-bold text-gray-900">Jane Doe</p>
                <p>123 Farm Lane</p>
                <p>Rural District, Iowa 50010</p>
                <p>United States</p>
                <p className="mt-2">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <CreditCard size={16} /> Payment Info
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <CreditCard size={14} /> Visa ending in 4242
                </p>
                <p className="mt-1">
                  Total Paid: <span className="font-bold text-gray-900">${selectedOrder.total.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900">Items</h4>
            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    fill 
                    src={`https://picsum.photos/200?random=${idx}`} 
                    alt={item.name} 
                    className="object-cover" 
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Calculation Summary */}
          <div className="border-t border-gray-100 pt-4 flex justify-end">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${(selectedOrder.total - 15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>$15.00</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default OrderDetailsModal;
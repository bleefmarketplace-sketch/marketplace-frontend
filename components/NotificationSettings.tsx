import React from 'react'

const NotificationSettings = () => {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Email Notifications</h3>
            {[
                'Order updates and delivery status',
                'New messages from buyers/sellers',
                'Community mentions and replies',
                'Weekly marketplace newsletter',
                'Promotional offers and discounts'
            ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                </div>
            ))}
        </div>
    </div>
  )
}

export default NotificationSettings
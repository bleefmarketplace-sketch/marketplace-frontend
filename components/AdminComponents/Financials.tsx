import React, { useState } from 'react'
import { Card } from '../Card'

const Financials = () => {
    const [fees, setFees] = useState({
            marketplaceCommission: 5.0,
            digitalCommission: 10.0,
            withdrawalFeePercent: 1.0,
            withdrawalFeeFixed: 0.50
        });
  return (
  <div className="space-y-6 animate-in fade-in">
               <h2 className="text-2xl font-bold">Financial Oversight</h2>
               
               <div className="grid md:grid-cols-2 gap-6">
                   <Card className="p-6">
                       <h3 className="font-bold text-gray-900 mb-4">Current Commission Rates</h3>
                       <div className="space-y-4">
                           <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                               <span>Product Sales</span>
                               <span className="font-bold text-green-600">{fees.marketplaceCommission}%</span>
                           </div>
                           <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                               <span>Digital Course Sales</span>
                               <span className="font-bold text-green-600">{fees.digitalCommission}%</span>
                           </div>
                           <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                               <span>Withdrawal Fee</span>
                               <span className="font-bold text-green-600">{fees.withdrawalFeePercent}% + ${fees.withdrawalFeeFixed}</span>
                           </div>
                       </div>
                       <p className="text-xs text-gray-400 mt-4 text-center">To change these rates, go to System Settings.</p>
                   </Card>
  
                   <Card className="p-6">
                       <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                       <div className="grid grid-cols-2 gap-4">
                           <div className="bg-blue-50 p-4 rounded-xl">
                               <p className="text-sm text-blue-700 mb-1">Total Payouts (YTD)</p>
                               <p className="text-2xl font-bold text-blue-900">$124,500</p>
                           </div>
                           <div className="bg-green-50 p-4 rounded-xl">
                               <p className="text-sm text-green-700 mb-1">Escrow Balance</p>
                               <p className="text-2xl font-bold text-green-900">$32,400</p>
                           </div>
                           <div className="bg-purple-50 p-4 rounded-xl">
                               <p className="text-sm text-purple-700 mb-1">Pending Refunds</p>
                               <p className="text-2xl font-bold text-purple-900">$1,250</p>
                           </div>
                       </div>
                   </Card>
               </div>
          </div>
  )
}

export default Financials
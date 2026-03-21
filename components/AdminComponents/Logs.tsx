import React from 'react'
import { Button } from '../Button'
import { Download, FileText } from 'lucide-react'
import { Card } from '../Card'

const Logs = () => {
  return (
      <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold">System Audit Logs</h2>
                 <Button variant="outline" size="sm"><Download size={16} className="mr-2"/> Export CSV</Button>
             </div>
             
             <Card noPadding>
                <div className="divide-y divide-gray-100">
                    {[
                        { action: 'Fee Structure Updated', detail: 'Marketplace commission changed to 5%', time: '2 mins ago', user: 'System Admin', ip: '192.168.1.1' },
                        { action: 'Refund Processed', detail: 'Order #921 refund approved by Admin_Sarah', time: '10 mins ago', user: 'Admin_Sarah', ip: '192.168.1.1' },
                        { action: 'User Suspended', detail: 'Seller "BadFarm" suspended for policy violation', time: '1 hour ago', user: 'Admin_Mike', ip: '192.168.1.42' },
                        { action: 'System Update', detail: 'Payout gateway configuration updated', time: '4 hours ago', user: 'System', ip: 'localhost' },
                        { action: 'Login Failed', detail: 'Multiple failed attempts for user admin@agri.com', time: '5 hours ago', user: 'Unknown', ip: '45.32.12.1' },
                    ].map((log, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex gap-4">
                                <div className="p-2 bg-gray-100 rounded text-gray-500 h-fit">
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{log.action}</p>
                                    <p className="text-xs text-gray-500">{log.detail}</p>
                                    <p className="text-xs text-gray-400 mt-1">User: {log.user} • IP: {log.ip}</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400 font-mono whitespace-nowrap">{log.time}</span>
                        </div>
                    ))}
                </div>
             </Card>
        </div>
  )
}

export default Logs
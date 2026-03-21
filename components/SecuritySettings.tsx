"use client";
import React from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { Lock, Shield } from 'lucide-react'

const SecuritySettings = () => {
  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <Shield className="text-yellow-600 mt-0.5" size={20} />
            <div>
                <h4 className="text-sm font-bold text-yellow-800">Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-yellow-700 mt-1">Add an extra layer of security to your account by enabling 2FA.</p>
                <Button size="sm" variant="outline" className="mt-3 border-yellow-600 text-yellow-700 hover:bg-yellow-100">Enable 2FA</Button>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Change Password</h3>
            <Input 
                label="Current Password" 
                type="password" 
                icon={<Lock size={18} />} 
            />
            <Input 
                label="New Password" 
                type="password" 
                icon={<Lock size={18} />} 
            />
            <Input
                label="Confirm New Password" 
                type="password" 
                icon={<Lock size={18} />} 
            />
            <div className="flex justify-end">
                <Button>Update Password</Button>
            </div>
        </div>
    </div>
  )
}

export default SecuritySettings
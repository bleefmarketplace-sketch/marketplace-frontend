import React, { useState } from 'react'

interface Props {
  userName: string
  onConfirm: (reason: string) => void
  onClose: () => void
}

const AdminUserDeleteModal: React.FC<Props> = ({
  userName,
  onConfirm,
  onClose,
}) => {
  const [reason, setReason] = useState('')

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-300 w-full max-w-md p-6 space-y-4 shadow-none rounded-none font-mono text-xs text-zinc-900">
        
        {/* Title */}
        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-2">
          Delete User Registry
        </h3>
        
        <p className="text-[10px] text-zinc-500 uppercase tracking-wide leading-relaxed">
          You are about to soft-delete user: <strong className="text-zinc-900 font-bold tracking-tight">{userName}</strong>.<br />
          This action is reversible by the network administrator.
        </p>

        {/* Reason Textarea */}
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="REASON FOR DELETION (REQUIRED)"
          className="w-full border border-zinc-300 rounded-none p-2 text-xs font-mono bg-white focus:outline-none focus:border-green-600 transition-colors uppercase placeholder:text-zinc-300"
          rows={4}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 border-t border-zinc-200 pt-3 select-none">
          <button 
            onClick={onClose}
            className="rounded-none h-9 px-4 font-mono font-bold uppercase tracking-wider text-[10px] bg-zinc-100 border border-zinc-300 text-zinc-700 hover:bg-zinc-200 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          
          <button
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason)}
            className="rounded-none h-9 px-4 font-mono font-bold uppercase tracking-wider text-[10px] bg-red-700 hover:bg-red-800 border border-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Confirm Delete
          </button>
        </div>

      </div>
    </div>
  )
}

export default AdminUserDeleteModal
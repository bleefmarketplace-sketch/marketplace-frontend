import React, { useState } from 'react'
import { Button } from '../Button'

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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
        <h3 className="text-lg font-bold">Delete User</h3>
        <p className="text-sm text-gray-600">
          You are about to delete <strong>{userName}</strong>.  
          This action is reversible.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for deletion (required)"
          className="w-full border rounded-md p-2 text-sm"
          rows={4}
        />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason)}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminUserDeleteModal
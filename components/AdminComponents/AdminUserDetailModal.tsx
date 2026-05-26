import { UserData } from "./UserManagement";

interface Props {
  user: UserData;
  onClose: () => void;
  onSuspend: () => void;
  onActivate: () => void;
}

const AdminUserDetailModal = ({ user, onClose, onSuspend, onActivate }: Props) => {
  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-none border border-zinc-300 p-6 space-y-6 shadow-none font-mono text-xs text-zinc-900">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-zinc-950">User Profile Details</h3>
          <button 
            onClick={onClose}
            className="w-6 h-6 border border-zinc-200 flex items-center justify-center font-bold text-[10px] hover:bg-zinc-50 transition-colors cursor-pointer select-none"
          >
            ✕
          </button>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-1">
          <div>
            <span className="text-zinc-400 block text-[9px] font-bold uppercase tracking-widest mb-0.5">FULL NAME</span>
            <span className="text-zinc-900 font-bold uppercase tracking-tight">{user.fullName}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[9px] font-bold uppercase tracking-widest mb-0.5">EMAIL ADDRESS</span>
            <span className="text-zinc-900 font-bold normal-case font-mono">{user.email}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[9px] font-bold uppercase tracking-widest mb-0.5">PORTAL ROLE</span>
            <span className={`inline-block px-1.5 py-0.5 rounded-none border text-[9px] font-bold uppercase tracking-wider ${
              user.role === 'seller' ? 'bg-purple-50 text-purple-700 border-purple-200' :
              user.role === 'creator' ? 'bg-orange-50 text-orange-700 border-orange-200' :
              user.role === 'admin' ? 'bg-red-50 text-red-700 border-red-200' :
              'bg-blue-50 text-blue-700 border-blue-200'
            }`}>{user.role}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[9px] font-bold uppercase tracking-widest mb-0.5">REGISTRATION DATE</span>
            <span className="text-zinc-900 font-bold">{new Date(user.createdAt).toISOString().substring(0, 10)}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[9px] font-bold uppercase tracking-widest mb-0.5">TELEPHONE CONTACT</span>
            <span className="text-zinc-900 font-bold">{user.phoneNumber ?? '—'}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[9px] font-bold uppercase tracking-widest mb-0.5">GEOGRAPHICAL REGION</span>
            <span className="text-zinc-900 font-bold uppercase tracking-tight">{user.location ?? '—'}</span>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="border-t border-zinc-200 pt-4 space-y-3">
          <h4 className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-700">Security Credentials & Registry</h4>
          <div className="grid grid-cols-2 gap-3 text-[9px] uppercase font-bold tracking-wider">
            
            <div className="flex items-center justify-between border border-zinc-150 p-2 bg-zinc-50 rounded-none">
              <span className="text-zinc-500">EMAIL STATE</span>
              {user.isEmailVerified ? (
                <span className="text-green-700 font-mono text-[8px] font-bold border border-green-200 bg-green-50 px-1.5 py-0.5">[ VERIFIED ]</span>
              ) : (
                <span className="text-red-700 font-mono text-[8px] font-bold border border-red-200 bg-red-50 px-1.5 py-0.5">[ UNVERIFIED ]</span>
              )}
            </div>

            <div className="flex items-center justify-between border border-zinc-150 p-2 bg-zinc-50 rounded-none">
              <span className="text-zinc-500">2FA CREDENTIAL</span>
              {user.isTwoFactorEnabled ? (
                <span className="text-green-700 font-mono text-[8px] font-bold border border-green-200 bg-green-50 px-1.5 py-0.5">[ ENABLED ]</span>
              ) : (
                <span className="text-zinc-400 font-mono text-[8px] font-bold border border-zinc-200 bg-zinc-100 px-1.5 py-0.5">[ DISABLED ]</span>
              )}
            </div>

            <div className="flex items-center justify-between border border-zinc-150 p-2 bg-zinc-50 rounded-none">
              <span className="text-zinc-500">KYC CLEARANCE</span>
              {user.isVerified ? (
                <span className="text-green-700 font-mono text-[8px] font-bold border border-green-200 bg-green-50 px-1.5 py-0.5">[ APPROVED ]</span>
              ) : (
                <span className="text-red-700 font-mono text-[8px] font-bold border border-red-200 bg-red-50 px-1.5 py-0.5">[ PENDING ]</span>
              )}
            </div>

            <div className="flex items-center justify-between border border-zinc-150 p-2 bg-zinc-50 rounded-none">
              <span className="text-zinc-500">ONBOARDED</span>
              {user.isOnboarded ? (
                <span className="text-green-700 font-mono text-[8px] font-bold border border-green-200 bg-green-50 px-1.5 py-0.5">[ LOGGED ]</span>
              ) : (
                <span className="text-amber-700 font-mono text-[8px] font-bold border border-amber-200 bg-amber-50 px-1.5 py-0.5">[ DRAFT ]</span>
              )}
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4 select-none">
          <button 
            onClick={onClose}
            className="rounded-none h-9 px-4 font-mono font-bold uppercase tracking-wider text-[10px] bg-zinc-100 border border-zinc-300 text-zinc-700 hover:bg-zinc-200 cursor-pointer transition-colors"
          >
            Close
          </button>
          
          {user.isSuspended ? (
            <button 
              onClick={onActivate}
              className="rounded-none h-9 px-4 font-mono font-bold uppercase tracking-wider text-[10px] bg-green-700 hover:bg-green-800 border border-green-700 text-white cursor-pointer transition-colors"
            >
              Activate Account
            </button>
          ) : (
            <button 
              onClick={onSuspend}
              className="rounded-none h-9 px-4 font-mono font-bold uppercase tracking-wider text-[10px] bg-red-700 hover:bg-red-800 border border-red-700 text-white cursor-pointer transition-colors"
            >
              Suspend Account
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminUserDetailModal;
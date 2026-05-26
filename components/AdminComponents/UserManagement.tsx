import { Activity, ArchiveRestore, Ban, CheckCircle, Delete, Filter, Search, Trash, XCircle } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../Button'
import { Card } from '../Card'
import { toast } from 'react-toastify';
import { useDebounce } from '@/hooks/debounceHook';
import AdminUserDetailModal from './AdminUserDetailModal';
import AdminUserCharts from './AdminUserCharts';
import AdminUserDeleteModal from './AdminUserDeleteModal';
import { UserBadge } from '../Marketplace/UserBadge';

export interface UserData {
    id: string;
    fullName: string;
    email: string;
    role: 'buyer' | 'seller' | 'admin' | 'creator';
    createdAt: string;

    phoneNumber?: string | null;
    location?: string | null;

    isEmailVerified: boolean;
    isVerified: boolean;
    isOnboarded: boolean;
    isTwoFactorEnabled: boolean;

    status: 'active' | 'pending' | 'suspended';
    lifetimeSalesVolume: number;

    isSuspended?: boolean;
    deletedAt: Date
}

const UserManagement = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const debouncedSearch = useDebounce(search, 500);
    const [role, setRole] = useState<string | undefined>();
    const [status, setStatus] = useState<string | undefined>();
    const limit = 10;

    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    const [deleteUser, setDeleteUser] = useState<UserData | null>(null)

    const [loading, setLoading] = useState(false)

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/admin/users?page=${page}&limit=${limit}&search=${debouncedSearch}&role=${role || ''}&status=${status || ''}`
            );
            if (!res.ok) throw new Error('Failed to fetch users');

            

            const result = await res.json();

            setUsers(result.data.data);
            setTotal(result.data?.total || 0);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, page, role, status]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);



    const updateUserStatus = async (id: string, action: 'suspend' | 'activate' | 'delete') => {
        try {
            const res = await fetch(`/api/admin/users/?id=${id}&action=${action}`, {
                method: 'PATCH',
            });
            if (!res.ok) throw new Error('Action failed');
            toast.success(`User ${action}d`);
            fetchUsers();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const softDeleteUser = async (id: string, reason: string) => {
        try {
            const res = await fetch(`/api/admin/users/${id}/delete`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason }),
            })

            if (!res.ok) throw new Error('Delete failed')

            toast.success('User deleted')
            setDeleteUser(null)
            fetchUsers()
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const restoreUser = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/users/${id}/restore`, {
                method: 'PATCH',
            })

            if (!res.ok) throw new Error('Restore failed')

            toast.success('User restored')
            fetchUsers()
        } catch (err: any) {
            toast.error(err.message)
        }
    }
    return (
        <div className="space-y-6 animate-in fade-in font-mono text-xs text-zinc-900">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-4">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-wider text-zinc-950">User Management</h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">View and manage all registered users.</p>
                </div>
                <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                        <input
                            value={search}
                            onChange={(e) => {
                                setPage(1);
                                setSearch(e.target.value);
                            }}
                            placeholder="Search users..."
                            className="pl-9 pr-4 py-1.5 border border-zinc-300 rounded-none text-xs w-full sm:w-64 font-mono bg-white focus:border-green-600 focus:outline-none transition-colors"
                        />
                    </div>
                    
                    <select 
                        onChange={(e) => setRole(e.target.value || undefined)}
                        className="border border-zinc-300 rounded-none text-xs font-mono bg-white px-3 py-1.5 focus:border-green-600 focus:outline-none cursor-pointer"
                    >
                        <option value="">All Roles</option>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                        <option value="creator">Creator</option>
                    </select>

                    <select 
                        onChange={(e) => setStatus(e.target.value || undefined)}
                        className="border border-zinc-300 rounded-none text-xs font-mono bg-white px-3 py-1.5 focus:border-green-600 focus:outline-none cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            <AdminUserCharts users={users} />

            <Card noPadding>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead className="text-[10px] text-zinc-500 uppercase bg-zinc-100 border-b border-zinc-200 tracking-widest font-mono font-bold">
                            <tr>
                                <th className="px-6 py-4 border-r border-zinc-200">User</th>
                                <th className="px-6 py-4 border-r border-zinc-200">Role</th>
                                <th className="px-6 py-4 border-r border-zinc-200">Status</th>
                                <th className="px-6 py-4 border-r border-zinc-200">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 font-mono">
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-zinc-400 uppercase tracking-wider font-bold">
                                        Loading user partition data...
                                    </td>
                                </tr>
                            )}
                            {!loading && users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-zinc-400 uppercase tracking-wider font-bold">
                                        No users matching query.
                                    </td>
                                </tr>
                            )}
                            {!loading && users.map(user => (
                                <tr key={user.id} className="bg-white hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-3.5 border-r border-zinc-200">
                                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedUser(user)}>
                                            <div className="w-8 h-8 rounded-none border border-zinc-200 bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 text-xs select-none">
                                                {user.role.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-zinc-900 uppercase tracking-tight hover:text-green-700 transition-colors">{user.fullName}</p>
                                                <p className="text-[10px] text-zinc-400 normal-case">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 border-r border-zinc-200">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-1.5 py-0.5 rounded-none border text-[9px] font-bold uppercase tracking-wider ${
                                                user.role === 'seller' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                user.role === 'creator' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                user.role === 'admin' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>{user.role}</span>
                                            
                                            {(user.role === 'seller' || user.role === 'creator') && user.lifetimeSalesVolume > 0 && (
                                                <span className="select-none">
                                                    <UserBadge volume={user.lifetimeSalesVolume} />
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 border-r border-zinc-200">
                                        {user.status === 'active' && (
                                            <span className="text-green-700 font-bold flex items-center gap-1.5 uppercase text-[10px] tracking-wide select-none">
                                                <span className="w-1.5 h-1.5 bg-green-600 rounded-none inline-block"></span> Active
                                            </span>
                                        )}
                                        {user.status === 'pending' && (
                                            <span className="text-amber-700 font-bold flex items-center gap-1.5 uppercase text-[10px] tracking-wide select-none">
                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-none inline-block"></span> Pending
                                            </span>
                                        )}
                                        {user.status === 'suspended' && (
                                            <span className="text-red-700 font-bold flex items-center gap-1.5 uppercase text-[10px] tracking-wide select-none">
                                                <span className="w-1.5 h-1.5 bg-red-600 rounded-none inline-block"></span> Suspended
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3.5 border-r border-zinc-200 text-zinc-500">
                                        {new Date(user.createdAt).toISOString().substring(0, 10)}
                                    </td>
                                    <td className="px-6 py-3.5 text-right select-none">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {user.deletedAt ? (
                                                <button
                                                    className="p-1 border border-zinc-200 text-blue-600 hover:bg-zinc-100 cursor-pointer transition-colors"
                                                    onClick={() => restoreUser(user.id)}
                                                    title="Restore User"
                                                >
                                                    <ArchiveRestore size={14} />
                                                </button>
                                            ) : (
                                                <button
                                                    className="p-1 border border-zinc-200 text-red-600 hover:bg-zinc-100 cursor-pointer transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteUser(user);
                                                    }}
                                                    title="Delete User"
                                                >
                                                    <Trash size={14} />
                                                </button>
                                            )}

                                            {user.status === 'active' ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateUserStatus(user.id, 'suspend');
                                                    }}
                                                    className="p-1 border border-zinc-200 text-zinc-650 hover:bg-zinc-100 cursor-pointer transition-colors"
                                                    title="Suspend User"
                                                >
                                                    <Ban size={14} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateUserStatus(user.id, 'activate');
                                                    }}
                                                    className="p-1 border border-zinc-200 text-green-700 hover:bg-zinc-100 cursor-pointer transition-colors"
                                                    title="Activate User"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end items-center gap-3 my-4 mr-4 select-none font-mono">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)}
                        className="rounded-none h-8 px-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 border border-zinc-300 text-zinc-700 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                        Prev
                    </button>

                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                        Page {page} / {Math.max(1, Math.ceil(total / limit))}
                    </span>

                    <button
                        disabled={page * limit >= total}
                        onClick={() => setPage(p => p + 1)}
                        className="rounded-none h-8 px-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 border border-zinc-300 text-zinc-700 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                        Next
                    </button>
                </div>
            </Card>

            {selectedUser && (
                <AdminUserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onSuspend={() => updateUserStatus(selectedUser.id, 'suspend')}
                    onActivate={() => updateUserStatus(selectedUser.id, 'activate')}
                />
            )}
            {deleteUser && (
                <AdminUserDeleteModal
                    userName={deleteUser.fullName}
                    onClose={() => setDeleteUser(null)}
                    onConfirm={(reason) =>
                        softDeleteUser(deleteUser.id, reason)
                    }
                />
            )}
        </div>
    )
}

export default UserManagement
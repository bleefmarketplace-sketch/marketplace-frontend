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
            setTotal(result.total);
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
        <div className="space-y-6 animate-in fade-in">

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <p className="text-gray-500">View and manage all registered users.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            value={search}
                            onChange={(e) => {
                                setPage(1);
                                setSearch(e.target.value);
                            }}
                            placeholder="Search users..."
                            className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64"
                        /></div>
                    <Button><Filter size={16} className="mr-2" /> Filter</Button>
                    <select onChange={(e) => setRole(e.target.value || undefined)}>
                        <option value="">All Roles</option>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
            <AdminUserCharts users={users} />

            <Card noPadding>
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading && (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-400">
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {users.map(user => (

                            <tr key={user.id} className="bg-white hover:bg-gray-50">

                                <td className="px-6 py-4" >
                                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedUser(user)}>
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">
                                            {user.role.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.fullName}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'seller' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'creator' ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>{user.role}</span>
                                    <span>{user.role === 'seller' && <UserBadge volume={user.lifetimeSalesVolume} />}

                                        {user.role === 'creator' && <UserBadge volume={user.lifetimeSalesVolume} />}


                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.status === 'active' && <span className="text-green-600 flex items-center gap-1 font-medium"><CheckCircle size={14} /> Active</span>}
                                    {user.status === 'pending' && <span className="text-yellow-600 flex items-center gap-1 font-medium"><Activity size={14} /> Pending</span>}
                                    {user.status === 'suspended' && <span className="text-red-600 flex items-center gap-1 font-medium"><XCircle size={14} /> Suspended</span>}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">

                                    {user.deletedAt ? (
                                        <button
                                            className="pr-3 text-blue-600 cursor-pointer"
                                            onClick={() => restoreUser(user.id)}

                                        >
                                            <ArchiveRestore size={16} color="blue" />
                                        </button>
                                    )
                                        : (
                                            <button
                                                className="pr-3 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setDeleteUser(user)
                                                }}
                                            >
                                                <Trash size={16} color="red" />
                                            </button>
                                        )
                                    }
                                    {user.status === 'active' ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateUserStatus(user.id, 'suspend');
                                            }}
                                            className='cursor-pointer'
                                        >
                                            <Ban size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateUserStatus(user.id, 'activate');
                                            }}
                                            className='cursor-pointer'
                                        >
                                            <CheckCircle size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-end items-center gap-2 my-4 mr-4">

                    <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                        Prev
                    </Button>

                    <span className="text-sm">
                        Page {page} of {Math.ceil(total / limit)}
                    </span>

                    <Button
                        disabled={page * limit >= total}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </Button>
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
'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../Card';
import { UserData } from './UserManagement';

interface Props {
  users: UserData[];
}

const COLORS = ['#22c55e', '#ef4444', '#facc15', '#6366f1'];

const AdminUserCharts = ({ users }: Props) => {
  const statusData = [
    { name: 'Active', value: users.filter(u => u.status === 'active').length },
    { name: 'Suspended', value: users.filter(u => u.status === 'suspended').length },
    { name: 'Pending', value: users.filter(u => u.status === 'pending').length },
  ];

  const roleData = [
    { role: 'Buyer', count: users.filter(u => u.role === 'buyer').length },
    { role: 'Seller', count: users.filter(u => u.role === 'seller').length },
    { role: 'Admin', count: users.filter(u => u.role === 'admin').length },
    { role: 'Creator', count: users.filter(u => u.role === 'creator').length },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* STATUS PIE */}
      <Card>
        <h3 className="font-bold mb-4">User Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >
              {statusData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* ROLE BAR */}
      <Card>
        <h3 className="font-bold mb-4">Users by Role</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={roleData}>
            <XAxis dataKey="role" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AdminUserCharts;
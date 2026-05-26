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

// Technical AgriTerminal desaturated status colors
const COLORS = ['#16803d', '#b91c1c', '#ca8a04', '#4f46e5'];

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none font-mono text-xs text-zinc-900">
      
      {/* STATUS PIE */}
      <Card className="rounded-none shadow-none border border-zinc-200 bg-white p-5">
        <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-700 mb-4 border-b border-zinc-150 pb-2">
          User Status Distribution
        </h3>
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
            <Tooltip 
              contentStyle={{ 
                fontFamily: 'var(--font-mono, monospace)', 
                fontSize: '10px',
                borderRadius: '0px',
                borderColor: '#e4e4e7',
                textTransform: 'uppercase'
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* ROLE BAR */}
      <Card className="rounded-none shadow-none border border-zinc-200 bg-white p-5">
        <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-700 mb-4 border-b border-zinc-150 pb-2">
          Users by Role
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={roleData}>
            <XAxis 
              dataKey="role" 
              tick={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', fill: '#71717a' }}
              axisLine={{ stroke: '#e4e4e7' }}
              tickLine={{ stroke: '#e4e4e7' }}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', fill: '#71717a' }}
              axisLine={{ stroke: '#e4e4e7' }}
              tickLine={{ stroke: '#e4e4e7' }}
            />
            <Tooltip 
              contentStyle={{ 
                fontFamily: 'var(--font-mono, monospace)', 
                fontSize: '10px',
                borderRadius: '0px',
                borderColor: '#e4e4e7',
                textTransform: 'uppercase'
              }} 
            />
            <Bar dataKey="count" fill="#4f46e5" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AdminUserCharts;
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Coins, 
  Clock, 
  Lock, 
  Vote,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const chartData = [
    { name: 'Jan', tokens: 4, vesting: 2, proposals: 1 },
    { name: 'Feb', tokens: 7, vesting: 3, proposals: 2 },
    { name: 'Mar', tokens: 12, vesting: 5, proposals: 3 },
    { name: 'Apr', tokens: 9, vesting: 4, proposals: 1 },
    { name: 'May', tokens: 15, vesting: 7, proposals: 4 },
    { name: 'Jun', tokens: 18, vesting: 6, proposals: 2 },
  ];

  const tokenDistribution = [
    { name: 'ERC-20', value: 60, color: '#8B5CF6' },
    { name: 'BEP-20', value: 25, color: '#06B6D4' },
    { name: 'Custom', value: 15, color: '#10B981' },
  ];

  const recentActivity = [
    { type: 'token', action: 'Created MYTOKEN', time: '2 hours ago', status: 'success' },
    { type: 'vesting', action: 'Vesting schedule updated', time: '4 hours ago', status: 'pending' },
    { type: 'proposal', action: 'New proposal created', time: '6 hours ago', status: 'success' },
    { type: 'gating', action: 'Access gate configured', time: '1 day ago', status: 'success' },
  ];

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">{title}</p>
          <p className="text-2xl font-semibold text-text-primary mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {change > 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm ml-1 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Math.abs(change)}%
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Dashboard</h2>
          <p className="text-text-secondary mt-1">Overview of your TokenSmith activity</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Coins className="w-4 h-4" />
          <span>Create New Token</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tokens Created" 
          value="24" 
          change={12} 
          icon={Coins} 
          color="bg-purple-medium" 
        />
        <StatCard 
          title="Active Vesting Schedules" 
          value="8" 
          change={-3} 
          icon={Clock} 
          color="bg-accent" 
        />
        <StatCard 
          title="Gated Content" 
          value="15" 
          change={25} 
          icon={Lock} 
          color="bg-primary" 
        />
        <StatCard 
          title="DAO Proposals" 
          value="6" 
          change={8} 
          icon={Vote} 
          color="bg-purple-light" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-text-primary">Activity Overview</h3>
            <MoreHorizontal className="w-5 h-5 text-text-secondary" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Line type="monotone" dataKey="tokens" stroke="#8B5CF6" strokeWidth={2} />
              <Line type="monotone" dataKey="vesting" stroke="#06B6D4" strokeWidth={2} />
              <Line type="monotone" dataKey="proposals" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Token Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-text-primary">Token Distribution</h3>
            <MoreHorizontal className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tokenDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {tokenDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-text-primary">Recent Activity</h3>
          <button className="text-accent text-sm font-medium hover:text-teal-400">View All</button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'token' ? 'bg-purple-medium/20' :
                  activity.type === 'vesting' ? 'bg-accent/20' :
                  activity.type === 'proposal' ? 'bg-primary/20' : 'bg-purple-light/20'
                }`}>
                  {activity.type === 'token' && <Coins className="w-4 h-4 text-purple-medium" />}
                  {activity.type === 'vesting' && <Clock className="w-4 h-4 text-accent" />}
                  {activity.type === 'proposal' && <Vote className="w-4 h-4 text-primary" />}
                  {activity.type === 'gating' && <Lock className="w-4 h-4 text-purple-light" />}
                </div>
                <div>
                  <p className="text-text-primary font-medium">{activity.action}</p>
                  <p className="text-text-secondary text-sm">{activity.time}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                activity.status === 'success' ? 'bg-green-400/20 text-green-400' :
                'bg-yellow-400/20 text-yellow-400'
              }`}>
                {activity.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
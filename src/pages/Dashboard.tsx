import React from 'react';
import { Users, Home, Calendar, Activity } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total de Residentes', value: '0', icon: Users },
    { label: 'Total de Residências', value: '0', icon: Home },
    { label: 'Visitas este Mês', value: '0', icon: Calendar },
    { label: 'Casos Ativos', value: '0', icon: Activity },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
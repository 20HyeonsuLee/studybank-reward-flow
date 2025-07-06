
import React from 'react';
import { TrendingUp, Calendar, Award, Users } from 'lucide-react';

const QuickStats = () => {
  const stats = [
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      label: '이번 주 출석',
      value: '4/5',
      change: '+20%',
      positive: true
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      label: '완료한 미션',
      value: '12',
      change: '+3',
      positive: true
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      label: '이번 달 수익',
      value: '₩ 15,000',
      change: '+₩ 5,000',
      positive: true
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      label: '참여 스터디',
      value: '3',
      change: '신규 1개',
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            {stat.icon}
            <span className={`text-xs px-2 py-1 rounded-full ${
              stat.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {stat.change}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;

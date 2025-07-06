
import React from 'react';
import { ArrowUp, ArrowDown, CheckCircle, XCircle } from 'lucide-react';

interface Activity {
  id: string;
  type: 'attendance' | 'mission' | 'payment' | 'reward';
  title: string;
  amount?: number;
  timestamp: string;
  status: 'positive' | 'negative' | 'neutral';
}

const RecentActivity = () => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'attendance',
      title: 'React 스터디 출석',
      amount: 0,
      timestamp: '2시간 전',
      status: 'positive'
    },
    {
      id: '2',
      type: 'mission',
      title: '알고리즘 문제 5개 풀기 완료',
      amount: 500,
      timestamp: '5시간 전',
      status: 'positive'
    },
    {
      id: '3',
      type: 'payment',
      title: '결석 벌금 차감',
      amount: -5000,
      timestamp: '1일 전',
      status: 'negative'
    },
    {
      id: '4',
      type: 'reward',
      title: '주간 모각코 1위 보상',
      amount: 2000,
      timestamp: '2일 전',
      status: 'positive'
    }
  ];

  const getIcon = (type: string, status: string) => {
    if (type === 'attendance') {
      return status === 'positive' ? 
        <CheckCircle className="w-5 h-5 text-green-600" /> : 
        <XCircle className="w-5 h-5 text-red-600" />;
    }
    return status === 'positive' ? 
      <ArrowUp className="w-5 h-5 text-green-600" /> : 
      <ArrowDown className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">최근 활동</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getIcon(activity.type, activity.status)}
              <div>
                <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
            {activity.amount !== 0 && (
              <span className={`font-medium ${
                activity.status === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {activity.status === 'positive' ? '+' : ''}{activity.amount?.toLocaleString()}P
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;

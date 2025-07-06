
import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';

interface StudyCardProps {
  title: string;
  participants: number;
  nextSession: string;
  depositAmount: number;
  attendanceRate: number;
  status: 'active' | 'completed' | 'upcoming';
}

const StudyCard = ({ title, participants, nextSession, depositAmount, attendanceRate, status }: StudyCardProps) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    upcoming: 'bg-blue-100 text-blue-800'
  };

  const statusText = {
    active: '진행중',
    completed: '완료',
    upcoming: '예정'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {statusText[status]}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600 text-sm">
          <Users className="w-4 h-4 mr-2" />
          참여자 {participants}명
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          다음 세션: {nextSession}
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <Clock className="w-4 h-4 mr-2" />
          출석률: {attendanceRate}%
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">예치금</span>
          <span className="font-semibold text-gray-800">₩ {depositAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default StudyCard;

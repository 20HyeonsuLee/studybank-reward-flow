
import React from 'react';
import { Target, Award, Timer } from 'lucide-react';

interface MissionCardProps {
  title: string;
  description: string;
  progress: number;
  reward: number;
  deadline: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const MissionCard = ({ title, description, progress, reward, deadline, difficulty }: MissionCardProps) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  const difficultyText = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[difficulty]}`}>
          {difficultyText[difficulty]}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">진행률</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-600 text-sm">
          <Timer className="w-4 h-4 mr-1" />
          {deadline}
        </div>
        <div className="flex items-center text-amber-600 font-medium">
          <Award className="w-4 h-4 mr-1" />
          {reward}P
        </div>
      </div>
    </div>
  );
};

export default MissionCard;

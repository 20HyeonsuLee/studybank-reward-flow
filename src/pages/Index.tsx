
import React from 'react';
import Header from '../components/Header';
import PointBalance from '../components/PointBalance';
import QuickStats from '../components/QuickStats';
import StudyCard from '../components/StudyCard';
import MissionCard from '../components/MissionCard';
import RecentActivity from '../components/RecentActivity';
import { Button } from '@/components/ui/button';
import { CheckSquare, Video, Search } from 'lucide-react';

const Index = () => {
  const mockStudies = [
    {
      title: 'React 마스터 스터디',
      participants: 8,
      nextSession: '2024년 7월 8일 19:00',
      depositAmount: 100000,
      attendanceRate: 85,
      status: 'active' as const
    },
    {
      title: '알고리즘 코딩테스트',
      participants: 12,
      nextSession: '2024년 7월 9일 20:00',
      depositAmount: 80000,
      attendanceRate: 92,
      status: 'active' as const
    },
    {
      title: 'CS 기초 스터디',
      participants: 6,
      nextSession: '완료',
      depositAmount: 50000,
      attendanceRate: 78,
      status: 'completed' as const
    }
  ];

  const mockMissions = [
    {
      title: '일일 코딩 챌린지',
      description: '매일 1개 이상의 알고리즘 문제 풀기',
      progress: 75,
      reward: 1000,
      deadline: '3일 남음',
      difficulty: 'medium' as const
    },
    {
      title: '프로젝트 완성하기',
      description: 'React 개인 프로젝트 완성 및 배포',
      progress: 45,
      reward: 5000,
      deadline: '1주 남음',
      difficulty: 'hard' as const
    },
    {
      title: '출석 체크',
      description: '이번 주 모든 스터디 참석하기',
      progress: 80,
      reward: 2000,
      deadline: '2일 남음',
      difficulty: 'easy' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 빠른 액세스 버튼 */}
        <div className="flex gap-4 mb-8">
          <Button onClick={() => window.location.href = '/study-management'} className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            스터디 관리
          </Button>
          <Button onClick={() => window.location.href = '/study-search'} className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            스터디 찾기
          </Button>
          <Button onClick={() => window.location.href = '/mogakco'} className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            모각공 참여
          </Button>
        </div>

        {/* 상단 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <PointBalance />
          </div>
          <div className="lg:col-span-2">
            <QuickStats />
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 스터디 섹션 */}
          <div className="xl:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">내 스터디</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockStudies.map((study, index) => (
                  <StudyCard key={index} {...study} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">진행 중인 미션</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockMissions.map((mission, index) => (
                  <MissionCard key={index} {...mission} />
                ))}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="xl:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

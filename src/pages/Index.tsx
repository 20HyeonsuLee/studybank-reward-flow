
import React from 'react';
import Header from '../components/Header';
import PointBalance from '../components/PointBalance';
import QuickStats from '../components/QuickStats';
import StudyCard from '../components/StudyCard';
import RecentActivity from '../components/RecentActivity';
import { Button } from '@/components/ui/button';
import { CheckSquare, Video, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const mockStudies = [
    {
      id: '1',
      title: 'React 마스터 스터디',
      participants: 8,
      nextSession: '2024년 7월 8일 19:00',
      depositAmount: 100000,
      attendanceRate: 85,
      status: 'active' as const
    },
    {
      id: '2',
      title: '알고리즘 코딩테스트',
      participants: 12,
      nextSession: '2024년 7월 9일 20:00',
      depositAmount: 80000,
      attendanceRate: 92,
      status: 'active' as const
    },
    {
      id: '3',
      title: 'CS 기초 스터디',
      participants: 6,
      nextSession: '완료',
      depositAmount: 50000,
      attendanceRate: 78,
      status: 'completed' as const
    }
  ];

  const handleStudyClick = (studyId: string) => {
    navigate(`/study-detail/${studyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 빠른 액세스 버튼 */}
        <div className="flex gap-4 mb-8">
          <Button onClick={() => navigate('/study-management')} className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            스터디 관리
          </Button>
          <Button onClick={() => navigate('/study-search')} className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            스터디 찾기
          </Button>
          <Button onClick={() => navigate('/mogakco')} className="flex items-center gap-2">
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
                {mockStudies.map((study) => (
                  <div key={study.id} onClick={() => handleStudyClick(study.id)} className="cursor-pointer">
                    <StudyCard {...study} />
                  </div>
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

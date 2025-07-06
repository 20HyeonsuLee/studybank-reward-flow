
import React, { useState } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Calendar, DollarSign, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PublicStudy {
  id: string;
  title: string;
  description: string;
  category: string;
  currentParticipants: number;
  maxParticipants: number;
  depositAmount: number;
  duration: string;
  location: string;
  schedule: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  organizer: string;
}

const StudySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const [publicStudies] = useState<PublicStudy[]>([
    {
      id: '1',
      title: 'JavaScript 기초부터 실전까지',
      description: '프론트엔드 개발을 위한 JavaScript 완전 정복 스터디입니다.',
      category: 'programming',
      currentParticipants: 6,
      maxParticipants: 10,
      depositAmount: 80000,
      duration: '8주',
      location: '강남역',
      schedule: '매주 토요일 14:00',
      difficulty: 'beginner',
      tags: ['JavaScript', '프론트엔드', '초보자환영'],
      organizer: '김개발'
    },
    {
      id: '2',
      title: 'React 심화 프로젝트 스터디',
      description: '실제 프로젝트를 만들면서 React를 깊이 있게 학습합니다.',
      category: 'programming',
      currentParticipants: 4,
      maxParticipants: 8,
      depositAmount: 120000,
      duration: '10주',
      location: '홍대입구',
      schedule: '매주 일요일 10:00',
      difficulty: 'advanced',
      tags: ['React', '프로젝트', '심화과정'],
      organizer: '박리액트'
    },
    {
      id: '3',
      title: '토익 900점 달성 스터디',
      description: '체계적인 학습 계획으로 토익 900점을 목표로 합니다.',
      category: 'language',
      currentParticipants: 8,
      maxParticipants: 12,
      depositAmount: 60000,
      duration: '12주',
      location: '신촌역',
      schedule: '매주 화, 목 19:00',
      difficulty: 'intermediate',
      tags: ['토익', '영어', '시험준비'],
      organizer: '이영어'
    }
  ]);

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'programming', label: '프로그래밍' },
    { value: 'language', label: '어학' },
    { value: 'certification', label: '자격증' },
    { value: 'employment', label: '취업준비' }
  ];

  const filteredStudies = publicStudies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || study.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const joinStudy = (studyId: string, studyTitle: string) => {
    toast({
      title: "참여 신청 완료",
      description: `${studyTitle} 스터디에 참여 신청이 완료되었습니다.`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return '미정';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">스터디 찾기</h1>
          
          {/* 검색 및 필터 */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="스터디 제목, 설명, 태그로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                {categories.map(category => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.value)}
                    className="whitespace-nowrap"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 스터디 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudies.map(study => (
            <Card key={study.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{study.title}</CardTitle>
                  <Badge className={getDifficultyColor(study.difficulty)}>
                    {getDifficultyText(study.difficulty)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{study.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {study.currentParticipants}/{study.maxParticipants}명
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {study.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {study.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {study.schedule}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    예치금 {study.depositAmount.toLocaleString()}원
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {study.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    스터디장: {study.organizer}
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => joinStudy(study.id, study.title)}
                    disabled={study.currentParticipants >= study.maxParticipants}
                  >
                    {study.currentParticipants >= study.maxParticipants ? '정원 마감' : '참여하기'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            <p className="text-gray-400 text-sm mt-2">다른 키워드로 검색해보세요.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudySearch;

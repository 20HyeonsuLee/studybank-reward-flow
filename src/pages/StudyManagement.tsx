import React, { useState } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users, Calendar, DollarSign, CheckSquare, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Study {
  id: string;
  title: string;
  participants: string[];
  totalSessions: number;
  currentSession: number;
  depositAmount: number;
  status: 'active' | 'completed';
  attendanceRecords: Record<string, boolean[]>;
  sessionDates: string[];
}

const StudyManagement = () => {
  const [studies, setStudies] = useState<Study[]>([
    {
      id: '1',
      title: 'React 마스터 스터디',
      participants: ['김철수', '이영희', '박민수', '정지은'],
      totalSessions: 8,
      currentSession: 6,
      depositAmount: 100000,
      status: 'active',
      attendanceRecords: {
        '김철수': [true, true, false, true, true, false],
        '이영희': [true, true, true, true, false, true],
        '박민수': [false, true, true, true, true, true],
        '정지은': [true, false, true, true, true, true],
      },
      sessionDates: ['2024-07-01', '2024-07-08', '2024-07-15', '2024-07-22', '2024-07-29', '2024-08-05']
    }
  ]);

  const [newStudyForm, setNewStudyForm] = useState({
    title: '',
    sessions: '',
    depositAmount: '',
    participants: ''
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const { toast } = useToast();

  const handleCreateStudy = () => {
    if (!newStudyForm.title || !newStudyForm.sessions || !newStudyForm.depositAmount) {
      toast({
        title: "오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    const participants = newStudyForm.participants.split(',').map(name => name.trim()).filter(Boolean);
    
    const newStudy: Study = {
      id: Date.now().toString(),
      title: newStudyForm.title,
      participants,
      totalSessions: parseInt(newStudyForm.sessions),
      currentSession: 0,
      depositAmount: parseInt(newStudyForm.depositAmount),
      status: 'active',
      attendanceRecords: {},
      sessionDates: []
    };

    participants.forEach(participant => {
      newStudy.attendanceRecords[participant] = new Array(parseInt(newStudyForm.sessions)).fill(false);
    });

    setStudies([...studies, newStudy]);
    setNewStudyForm({ title: '', sessions: '', depositAmount: '', participants: '' });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "스터디 생성 완료",
      description: `${newStudyForm.title} 스터디가 생성되었습니다.`,
    });
  };

  const toggleAttendance = (studyId: string, participant: string, sessionIndex: number) => {
    setStudies(studies.map(study => {
      if (study.id === studyId) {
        const updatedRecords = { ...study.attendanceRecords };
        updatedRecords[participant][sessionIndex] = !updatedRecords[participant][sessionIndex];
        return { ...study, attendanceRecords: updatedRecords };
      }
      return study;
    }));
  };

  const calculateSettlement = (study: Study) => {
    const results = study.participants.map(participant => {
      const attendanceRecord = study.attendanceRecords[participant] || [];
      const attendedSessions = attendanceRecord.filter(Boolean).length;
      const missedSessions = study.totalSessions - attendedSessions;
      const penalty = missedSessions * 10000; // 결석 1회당 10,000원 벌금
      const refund = study.depositAmount - penalty;
      
      return {
        participant,
        attendedSessions,
        missedSessions,
        penalty,
        refund: Math.max(0, refund)
      };
    });
    
    return results;
  };

  const completeStudy = (studyId: string) => {
    const study = studies.find(s => s.id === studyId);
    if (!study) return;

    const settlement = calculateSettlement(study);
    
    setStudies(studies.map(s => 
      s.id === studyId ? { ...s, status: 'completed' as const } : s
    ));

    toast({
      title: "스터디 완료",
      description: "정산이 완료되었습니다. 포인트가 자동으로 환불됩니다.",
    });

    console.log('정산 결과:', settlement);
  };

  const addSession = (studyId: string) => {
    setStudies(studies.map(study => {
      if (study.id === studyId && study.currentSession < study.totalSessions) {
        const newSession = study.currentSession + 1;
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 7); // 다음 주
        
        const updatedAttendance = { ...study.attendanceRecords };
        study.participants.forEach(participant => {
          updatedAttendance[participant] = [...(updatedAttendance[participant] || []), false];
        });

        return {
          ...study,
          currentSession: newSession,
          sessionDates: [...study.sessionDates, newDate.toISOString().split('T')[0]],
          attendanceRecords: updatedAttendance
        };
      }
      return study;
    }));

    toast({
      title: "회차 추가 완료",
      description: "새로운 회차가 추가되었습니다.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">스터디 관리</h1>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                새 스터디 생성
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>새 스터디 생성</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">스터디 제목</Label>
                  <Input
                    id="title"
                    value={newStudyForm.title}
                    onChange={(e) => setNewStudyForm({...newStudyForm, title: e.target.value})}
                    placeholder="스터디 제목을 입력하세요"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sessions">총 회차 수</Label>
                  <Input
                    id="sessions"
                    type="number"
                    value={newStudyForm.sessions}
                    onChange={(e) => setNewStudyForm({...newStudyForm, sessions: e.target.value})}
                    placeholder="8"
                  />
                </div>
                
                <div>
                  <Label htmlFor="deposit">예치금 (원)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={newStudyForm.depositAmount}
                    onChange={(e) => setNewStudyForm({...newStudyForm, depositAmount: e.target.value})}
                    placeholder="100000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="participants">참여자 (쉼표로 구분)</Label>
                  <Input
                    id="participants"
                    value={newStudyForm.participants}
                    onChange={(e) => setNewStudyForm({...newStudyForm, participants: e.target.value})}
                    placeholder="김철수, 이영희, 박민수"
                  />
                </div>
                
                <Button onClick={handleCreateStudy} className="w-full">
                  스터디 생성
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {studies.map(study => (
            <Card key={study.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span>{study.title}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      study.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {study.status === 'active' ? '진행중' : '완료'}
                    </span>
                  </CardTitle>
                  
                  <div className="flex gap-2">
                    {study.status === 'active' && study.currentSession < study.totalSessions && (
                      <Button
                        variant="outline"
                        onClick={() => addSession(study.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        회차 추가
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setSelectedStudy(selectedStudy?.id === study.id ? null : study)}
                    >
                      <CheckSquare className="w-4 h-4 mr-2" />
                      출석 관리
                    </Button>
                    
                    {study.status === 'active' && (
                      <Button
                        onClick={() => completeStudy(study.id)}
                        variant="destructive"
                      >
                        스터디 종료
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {study.participants.length}명
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {study.currentSession}/{study.totalSessions}회차
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    진행률 {Math.round((study.currentSession / study.totalSessions) * 100)}%
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    예치금 {study.depositAmount.toLocaleString()}원
                  </div>
                </div>
              </CardHeader>
              
              {selectedStudy?.id === study.id && (
                <CardContent>
                  <div className="space-y-4">
                    <h4 className="font-semibold">출석 현황</h4>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>참여자</TableHead>
                            {Array.from({ length: study.totalSessions }, (_, i) => (
                              <TableHead key={i} className="text-center">
                                {i + 1}회
                              </TableHead>
                            ))}
                            <TableHead>출석률</TableHead>
                            <TableHead>예상 환불액</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {study.participants.map(participant => {
                            const attendanceRecord = study.attendanceRecords[participant] || [];
                            const attendedCount = attendanceRecord.filter(Boolean).length;
                            const attendanceRate = Math.round((attendedCount / study.totalSessions) * 100);
                            const missedSessions = study.totalSessions - attendedCount;
                            const penalty = missedSessions * 10000;
                            const refund = Math.max(0, study.depositAmount - penalty);
                            
                            return (
                              <TableRow key={participant}>
                                <TableCell className="font-medium">{participant}</TableCell>
                                {attendanceRecord.map((attended, sessionIndex) => (
                                  <TableCell key={sessionIndex} className="text-center">
                                    <Button
                                      variant={attended ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => toggleAttendance(study.id, participant, sessionIndex)}
                                      className="w-8 h-8 p-0"
                                    >
                                      {attended ? '✓' : '✗'}
                                    </Button>
                                  </TableCell>
                                ))}
                                <TableCell className="text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    attendanceRate >= 80 ? 'bg-green-100 text-green-800' : 
                                    attendanceRate >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {attendanceRate}%
                                  </span>
                                </TableCell>
                                <TableCell className="font-semibold">
                                  {refund.toLocaleString()}원
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudyManagement;

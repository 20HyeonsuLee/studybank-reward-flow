
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const StudyDetail = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would be fetched based on studyId
  const studyData = {
    id: studyId,
    title: 'React 마스터 스터디',
    description: 'React의 기초부터 고급 개념까지 체계적으로 학습하는 스터디입니다.',
    totalSessions: 8,
    currentSession: 6,
    depositAmount: 100000,
    status: 'active',
    participants: [
      {
        name: '김철수',
        attendanceRecord: [true, true, false, true, true, false],
        attendanceRate: 67,
        expectedRefund: 80000
      },
      {
        name: '이영희',
        attendanceRecord: [true, true, true, true, false, true],
        attendanceRate: 83,
        expectedRefund: 90000
      },
      {
        name: '박민수',
        attendanceRecord: [false, true, true, true, true, true],
        attendanceRate: 83,
        expectedRefund: 90000
      },
      {
        name: '정지은',
        attendanceRecord: [true, false, true, true, true, true],
        attendanceRate: 83,
        expectedRefund: 90000
      }
    ],
    sessionDates: ['2024-07-01', '2024-07-08', '2024-07-15', '2024-07-22', '2024-07-29', '2024-08-05']
  };

  const totalDeposit = studyData.participants.length * studyData.depositAmount;
  const averageAttendance = Math.round(
    studyData.participants.reduce((sum, p) => sum + p.attendanceRate, 0) / studyData.participants.length
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{studyData.title}</h1>
            <p className="text-gray-600 mt-2">{studyData.description}</p>
          </div>
        </div>

        {/* 스터디 개요 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">참여자</p>
                  <p className="text-2xl font-bold">{studyData.participants.length}명</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">진행률</p>
                  <p className="text-2xl font-bold">{studyData.currentSession}/{studyData.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">총 예치금</p>
                  <p className="text-2xl font-bold">{totalDeposit.toLocaleString()}원</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">평균 출석률</p>
                  <p className="text-2xl font-bold">{averageAttendance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 참여자별 상세 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>참여자별 출석 및 예치금 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>참여자</TableHead>
                    {Array.from({ length: studyData.totalSessions }, (_, i) => (
                      <TableHead key={i} className="text-center">
                        {i + 1}회
                      </TableHead>
                    ))}
                    <TableHead>출석률</TableHead>
                    <TableHead>예치금</TableHead>
                    <TableHead>예상 환불액</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studyData.participants.map((participant, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{participant.name}</TableCell>
                      {participant.attendanceRecord.map((attended, sessionIndex) => (
                        <TableCell key={sessionIndex} className="text-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            attended ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {attended ? '✓' : '✗'}
                          </div>
                        </TableCell>
                      ))}
                      <TableCell>
                        <Badge variant={participant.attendanceRate >= 80 ? "default" : participant.attendanceRate >= 60 ? "secondary" : "destructive"}>
                          {participant.attendanceRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {studyData.depositAmount.toLocaleString()}원
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {participant.expectedRefund.toLocaleString()}원
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudyDetail;

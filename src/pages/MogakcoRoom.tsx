import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Mic, MicOff, Monitor, ScreenShare, MessageSquare, Users, ArrowLeft, Send, Trophy, Star, Target, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
}

interface Participant {
  id: string;
  name: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  isScreenSharing: boolean;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  progress: Record<string, number>; // participantName -> progress percentage
  completed: Record<string, boolean>; // participantName -> completion status
}

const MogakcoRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: '김개발',
      message: '안녕하세요! 오늘도 열심히 해봅시다!',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      sender: '이코딩',
      message: '네! 저는 백준 문제 풀 예정입니다',
      timestamp: new Date(Date.now() - 240000)
    }
  ]);
  
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: '나', videoEnabled: true, audioEnabled: true, isScreenSharing: false },
    { id: '2', name: '김개발', videoEnabled: true, audioEnabled: true, isScreenSharing: false },
    { id: '3', name: '이코딩', videoEnabled: false, audioEnabled: true, isScreenSharing: false }
  ]);

  // Mission-related states
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      title: '알고리즘 문제 3개 풀기',
      description: '백준 또는 프로그래머스에서 알고리즘 문제 3개 해결',
      createdBy: '김개발',
      progress: { '나': 33, '김개발': 100, '이코딩': 67 },
      completed: { '나': false, '김개발': true, '이코딩': false }
    }
  ]);
  const [showMissions, setShowMissions] = useState(false);
  const [newMission, setNewMission] = useState({ title: '', description: '' });
  const [isAddingMission, setIsAddingMission] = useState(false);

  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);
  const [participantScores, setParticipantScores] = useState<Record<string, number>>({
    '나': 0,
    '김개발': 0,
    '이코딩': 0
  });
  const [hasEnded, setHasEnded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock: 웹캠 스트림 시뮬레이션
    if (videoRef.current && isVideoOn) {
      // 실제로는 navigator.mediaDevices.getUserMedia()를 사용
      console.log('비디오 스트림 시작');
    }
  }, [isVideoOn]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const updateScore = (participantId: string, score: number) => {
    setParticipantScores(prev => ({
      ...prev,
      [participantId]: score
    }));
  };

  const addMission = () => {
    if (!newMission.title.trim() || !newMission.description.trim()) {
      toast({
        title: "오류",
        description: "미션 제목과 설명을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    const mission: Mission = {
      id: Date.now().toString(),
      title: newMission.title,
      description: newMission.description,
      createdBy: '나',
      progress: participants.reduce((acc, p) => ({ ...acc, [p.name]: 0 }), {}),
      completed: participants.reduce((acc, p) => ({ ...acc, [p.name]: false }), {})
    };

    setMissions([...missions, mission]);
    setNewMission({ title: '', description: '' });
    setIsAddingMission(false);

    toast({
      title: "미션 추가 완료",
      description: `"${mission.title}" 미션이 추가되었습니다.`,
    });
  };

  const updateMissionProgress = (missionId: string, participant: string, progress: number) => {
    setMissions(missions.map(mission => {
      if (mission.id === missionId) {
        const newCompleted = { ...mission.completed };
        newCompleted[participant] = progress >= 100;
        
        return {
          ...mission,
          progress: { ...mission.progress, [participant]: Math.min(100, Math.max(0, progress)) },
          completed: newCompleted
        };
      }
      return mission;
    }));
  };

  const calculateMissionRewards = () => {
    const missionScores: Record<string, number> = {};
    participants.forEach(p => { missionScores[p.name] = 0; });

    missions.forEach(mission => {
      const completedParticipants = Object.entries(mission.completed)
        .filter(([_, completed]) => completed)
        .map(([name, _]) => name);

      if (completedParticipants.length > 0) {
        // 완료한 사람들에게 점수 부여 (완료 순서대로 더 높은 점수)
        const sortedByProgress = completedParticipants.sort((a, b) => 
          mission.progress[b] - mission.progress[a]
        );
        
        sortedByProgress.forEach((participant, index) => {
          const points = Math.max(100 - (index * 20), 20);
          missionScores[participant] += points;
        });
      }
    });

    return missionScores;
  };

  const endMogakco = () => {
    const missionScores = calculateMissionRewards();
    const finalScores = { ...participantScores };
    
    // 미션 점수를 최종 점수에 반영
    Object.entries(missionScores).forEach(([name, score]) => {
      finalScores[name] = (finalScores[name] || 0) + score;
    });

    const sortedParticipants = Object.entries(finalScores)
      .sort(([,a], [,b]) => b - a)
      .map(([name, score], index) => ({
        name,
        score,
        rank: index + 1,
        reward: index === 0 ? 5000 : index === 1 ? 3000 : index === 2 ? 1000 : 0
      }));

    setHasEnded(true);
    setIsEndDialogOpen(true);

    const winner = sortedParticipants[0];
    if (winner.name === '나' && winner.reward > 0) {
      toast({
        title: "🎉 축하합니다!",
        description: `1등으로 ${winner.reward.toLocaleString()}원의 리워드를 받았습니다!`,
      });
    }

    console.log('모각공 종료 - 순위:', sortedParticipants);
    console.log('미션 점수:', missionScores);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "비디오 끄기" : "비디오 켜기",
      description: isVideoOn ? "비디오가 꺼졌습니다." : "비디오가 켜졌습니다.",
    });
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast({
      title: isAudioOn ? "마이크 끄기" : "마이크 켜기", 
      description: isAudioOn ? "마이크가 꺼졌습니다." : "마이크가 켜졌습니다.",
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "화면 공유 중지" : "화면 공유 시작",
      description: isScreenSharing ? "화면 공유가 중지되었습니다." : "화면 공유가 시작되었습니다.",
    });
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: '나',
        message: chatMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
  };

  const leaveRoom = () => {
    navigate('/mogakco');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 상단 헤더 */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={leaveRoom}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">알고리즘 문제 해결 - 방 #{roomId}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>{participants.length}명 참여중</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowMissions(!showMissions)}
          >
            <Target className="w-4 h-4 mr-2" />
            미션 관리
          </Button>
          {!hasEnded && (
            <Button variant="destructive" onClick={() => setIsEndDialogOpen(true)}>
              모각공 종료
            </Button>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 메인 비디오 영역 */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* 내 화면 */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex-1 bg-gray-700 rounded-lg flex items-center justify-center relative">
                  {isVideoOn ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover rounded-lg"
                      autoPlay
                      muted
                    />
                  ) : (
                    <div className="text-6xl">👤</div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                    나 {!isAudioOn && '🔇'}
                  </div>
                  {isScreenSharing && (
                    <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded text-xs">
                      화면 공유중
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 다른 참여자들 화면 */}
            {participants.slice(1).map(participant => (
              <Card key={participant.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="flex-1 bg-gray-700 rounded-lg flex items-center justify-center relative">
                    {participant.videoEnabled ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl">
                        📹 {participant.name}
                      </div>
                    ) : (
                      <div className="text-6xl">👤</div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                      {participant.name} {!participant.audioEnabled && '🔇'}
                    </div>
                    {participant.isScreenSharing && (
                      <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded text-xs">
                        화면 공유중
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 하단 컨트롤 */}
          <div className="mt-4 flex justify-center gap-4">
            <Button
              variant={isVideoOn ? "default" : "destructive"}
              onClick={toggleVideo}
              className="w-12 h-12 rounded-full"
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            
            <Button
              variant={isAudioOn ? "default" : "destructive"}
              onClick={toggleAudio}
              className="w-12 h-12 rounded-full"
            >
              {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            
            <Button
              variant={isScreenSharing ? "destructive" : "outline"}
              onClick={toggleScreenShare}
              className="w-12 h-12 rounded-full"
            >
              {isScreenSharing ? <Monitor className="w-5 h-5" /> : <ScreenShare className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsChatVisible(!isChatVisible)}
              className="w-12 h-12 rounded-full"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 채팅/미션 사이드바 */}
        {(isChatVisible || showMissions) && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* 탭 헤더 */}
            <div className="p-4 border-b border-gray-700 flex gap-2">
              <Button
                variant={isChatVisible && !showMissions ? "default" : "ghost"}
                size="sm"
                onClick={() => { setIsChatVisible(true); setShowMissions(false); }}
              >
                채팅
              </Button>
              <Button
                variant={showMissions ? "default" : "ghost"}
                size="sm"
                onClick={() => { setShowMissions(true); setIsChatVisible(false); }}
              >
                미션
              </Button>
            </div>
            
            {/* 채팅 영역 */}
            {isChatVisible && !showMissions && (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="font-medium">{msg.sender}</span>
                        <span>{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className="text-sm bg-gray-700 p-2 rounded">
                        {msg.message}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="메시지를 입력하세요..."
                      className="bg-gray-700 border-gray-600"
                    />
                    <Button onClick={sendMessage} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* 미션 영역 */}
            {showMissions && (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">진행 중인 미션</h3>
                    <Button
                      size="sm"
                      onClick={() => setIsAddingMission(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      추가
                    </Button>
                  </div>

                  {missions.map(mission => (
                    <Card key={mission.id} className="bg-gray-700 border-gray-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{mission.title}</CardTitle>
                        <p className="text-xs text-gray-400">{mission.description}</p>
                        <p className="text-xs text-gray-500">작성자: {mission.createdBy}</p>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-2">
                          {participants.map(participant => (
                            <div key={participant.name} className="flex items-center justify-between">
                              <span className="text-sm">{participant.name}</span>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={mission.progress[participant.name] || 0}
                                  onChange={(e) => updateMissionProgress(
                                    mission.id, 
                                    participant.name, 
                                    parseInt(e.target.value) || 0
                                  )}
                                  className="w-16 h-6 text-xs bg-gray-600 border-gray-500"
                                />
                                <span className="text-xs">%</span>
                                {mission.completed[participant.name] && (
                                  <Badge variant="default" className="text-xs px-1">완료</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* 미션 추가 폼 */}
                  {isAddingMission && (
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 space-y-3">
                        <Input
                          placeholder="미션 제목"
                          value={newMission.title}
                          onChange={(e) => setNewMission({...newMission, title: e.target.value})}
                          className="bg-gray-600 border-gray-500"
                        />
                        <Input
                          placeholder="미션 설명"
                          value={newMission.description}
                          onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                          className="bg-gray-600 border-gray-500"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={addMission}>추가</Button>
                          <Button size="sm" variant="ghost" onClick={() => setIsAddingMission(false)}>취소</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 종료 다이얼로그 */}
      <Dialog open={isEndDialogOpen} onOpenChange={setIsEndDialogOpen}>
        <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              모각공 결과
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">최종 순위</h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center text-gray-300">순위</TableHead>
                    <TableHead className="text-gray-300">참여자</TableHead>
                    <TableHead className="text-center text-gray-300">점수</TableHead>
                    <TableHead className="text-center text-gray-300">리워드</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(calculateMissionRewards())
                    .map(([name, missionScore]) => ({
                      name,
                      totalScore: (participantScores[name] || 0) + missionScore
                    }))
                    .sort((a, b) => b.totalScore - a.totalScore)
                    .map((participant, index) => (
                      <TableRow key={participant.name}>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            {index === 0 && <Star className="w-4 h-4 text-yellow-400 mr-1" />}
                            {index + 1}등
                          </div>
                        </TableCell>
                        <TableCell>{participant.name}</TableCell>
                        <TableCell className="text-center">{participant.totalScore}점</TableCell>
                        <TableCell className="text-center font-semibold text-green-400">
                          {index === 0 ? '5,000원' : index === 1 ? '3,000원' : index === 2 ? '1,000원' : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            
            <Button onClick={leaveRoom} className="w-full">
              나가기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MogakcoRoom;

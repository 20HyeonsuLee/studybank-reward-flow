import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Video, VideoOff, Mic, MicOff, Monitor, ScreenShare, MessageSquare, Users, ArrowLeft, Send, Trophy, Star } from 'lucide-react';
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

  const endMogakco = () => {
    const sortedParticipants = Object.entries(participantScores)
      .sort(([,a], [,b]) => b - a)
      .map(([name, score], index) => ({
        name,
        score,
        rank: index + 1,
        reward: index === 0 ? 5000 : index === 1 ? 3000 : index === 2 ? 1000 : 0
      }));

    setHasEnded(true);
    setIsEndDialogOpen(true);

    // 1등에게 리워드 지급
    const winner = sortedParticipants[0];
    if (winner.name === '나' && winner.reward > 0) {
      toast({
        title: "🎉 축하합니다!",
        description: `1등으로 ${winner.reward.toLocaleString()}원의 리워드를 받았습니다!`,
      });
    }

    console.log('모각공 종료 - 순위:', sortedParticipants);
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

        {/* 채팅 사이드바 */}
        {isChatVisible && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">채팅</h3>
            </div>
            
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MogakcoRoom;

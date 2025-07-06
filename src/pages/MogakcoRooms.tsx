import React, { useState } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Clock, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface MogakcoRoom {
  id: string;
  title: string;
  description: string;
  participants: number;
  maxParticipants: number;
  duration: number;
  status: 'waiting' | 'active' | 'completed';
  creator: string;
}

const MogakcoRooms = () => {
  const [rooms, setRooms] = useState<MogakcoRoom[]>([
    {
      id: '1',
      title: '알고리즘 문제 해결',
      description: '백준 골드 문제를 함께 풀어봐요',
      participants: 3,
      maxParticipants: 6,
      duration: 120,
      status: 'active',
      creator: '김개발'
    },
    {
      id: '2',
      title: 'React 프로젝트 작업',
      description: '개인 프로젝트 개발하면서 서로 도움주기',
      participants: 2,
      maxParticipants: 4,
      duration: 180,
      status: 'waiting',
      creator: '이리액트'
    }
  ]);

  const [newRoomForm, setNewRoomForm] = useState({
    title: '',
    description: '',
    maxParticipants: '',
    duration: ''
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!newRoomForm.title || !newRoomForm.maxParticipants || !newRoomForm.duration) {
      toast({
        title: "오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    const newRoom: MogakcoRoom = {
      id: Date.now().toString(),
      title: newRoomForm.title,
      description: newRoomForm.description,
      participants: 1,
      maxParticipants: parseInt(newRoomForm.maxParticipants),
      duration: parseInt(newRoomForm.duration),
      status: 'waiting',
      creator: '나'
    };

    setRooms([...rooms, newRoom]);
    setNewRoomForm({ title: '', description: '', maxParticipants: '', duration: '' });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "방 생성 완료",
      description: `${newRoomForm.title} 방이 생성되었습니다.`,
    });
  };

  const joinRoom = (roomId: string) => {
    navigate(`/mogakco/${roomId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '진행중';
      case 'waiting': return '대기중';
      case 'completed': return '완료';
      default: return '알 수 없음';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">모각공 방</h1>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                새 방 만들기
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>새 모각공 방 만들기</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">방 제목</Label>
                  <Input
                    id="title"
                    value={newRoomForm.title}
                    onChange={(e) => setNewRoomForm({...newRoomForm, title: e.target.value})}
                    placeholder="방 제목을 입력하세요"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">방 설명</Label>
                  <Input
                    id="description"
                    value={newRoomForm.description}
                    onChange={(e) => setNewRoomForm({...newRoomForm, description: e.target.value})}
                    placeholder="어떤 모각공인지 설명해주세요"
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxParticipants">최대 참여자 수</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newRoomForm.maxParticipants}
                    onChange={(e) => setNewRoomForm({...newRoomForm, maxParticipants: e.target.value})}
                    placeholder="6"
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">예상 시간 (분)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newRoomForm.duration}
                    onChange={(e) => setNewRoomForm({...newRoomForm, duration: e.target.value})}
                    placeholder="120"
                  />
                </div>
                
                <Button onClick={handleCreateRoom} className="w-full">
                  방 만들기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{room.title}</CardTitle>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(room.status)}`}>
                    {getStatusText(room.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{room.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {room.participants}/{room.maxParticipants}명
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {room.duration}분
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    방장: {room.creator}
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => joinRoom(room.id)}
                    disabled={room.participants >= room.maxParticipants}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {room.participants >= room.maxParticipants ? '방이 가득참' : '참여하기'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MogakcoRooms;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PointChargeDialogProps {
  children: React.ReactNode;
}

const PointChargeDialog = ({ children }: PointChargeDialogProps) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleCharge = () => {
    if (!amount || parseInt(amount) < 1000) {
      toast({
        title: "충전 실패",
        description: "최소 1,000원 이상 충전해주세요.",
        variant: "destructive",
      });
      return;
    }

    // Mock 충전 처리
    toast({
      title: "충전 완료",
      description: `${parseInt(amount).toLocaleString()}원이 충전되었습니다.`,
    });
    
    setIsOpen(false);
    setAmount('');
  };

  const presets = [10000, 30000, 50000, 100000];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>포인트 충전</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="amount">충전 금액</Label>
            <Input
              id="amount"
              type="number"
              placeholder="충전할 금액을 입력하세요"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <Button
                key={preset}
                variant="outline"
                onClick={() => setAmount(preset.toString())}
                className="text-sm"
              >
                {preset.toLocaleString()}원
              </Button>
            ))}
          </div>

          <div>
            <Label>결제 수단</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="flex flex-col p-4 h-auto"
              >
                <CreditCard className="w-6 h-6 mb-1" />
                <span className="text-xs">카드</span>
              </Button>
              <Button
                variant={paymentMethod === 'phone' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('phone')}
                className="flex flex-col p-4 h-auto"
              >
                <Smartphone className="w-6 h-6 mb-1" />
                <span className="text-xs">휴대폰</span>
              </Button>
              <Button
                variant={paymentMethod === 'bank' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('bank')}
                className="flex flex-col p-4 h-auto"
              >
                <Banknote className="w-6 h-6 mb-1" />
                <span className="text-xs">계좌이체</span>
              </Button>
            </div>
          </div>

          <Button onClick={handleCharge} className="w-full">
            {amount ? `${parseInt(amount).toLocaleString()}원 ` : ''}충전하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PointChargeDialog;

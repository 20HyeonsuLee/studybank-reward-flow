
import React from 'react';
import { TrendingUp, Plus, Minus } from 'lucide-react';
import PointChargeDialog from './PointChargeDialog';

const PointBalance = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">포인트 잔액</h2>
        <TrendingUp className="w-5 h-5" />
      </div>
      
      <div className="text-3xl font-bold mb-6">
        ₩ 87,500
      </div>
      
      <div className="flex space-x-3">
        <PointChargeDialog>
          <button className="flex-1 bg-white/20 hover:bg-white/30 transition-colors rounded-lg py-2 px-4 flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">충전</span>
          </button>
        </PointChargeDialog>
        <button className="flex-1 bg-white/20 hover:bg-white/30 transition-colors rounded-lg py-2 px-4 flex items-center justify-center space-x-2">
          <Minus className="w-4 h-4" />
          <span className="text-sm font-medium">환불</span>
        </button>
      </div>
    </div>
  );
};

export default PointBalance;

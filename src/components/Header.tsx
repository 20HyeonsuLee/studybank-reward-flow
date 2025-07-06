
import React from 'react';
import { User, Settings, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">💸</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">StudyBank</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
          <Settings className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

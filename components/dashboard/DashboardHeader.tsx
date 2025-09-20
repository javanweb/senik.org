import React from 'react';
import { SearchIcon, BellIcon } from '../Icons';

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-20 flex items-center justify-between px-6 flex-shrink-0">
      <div className="relative">
        <input
          type="text"
          placeholder="جستجو..."
          className="bg-gray-100 rounded-full py-2 pr-10 pl-4 w-64 focus:outline-none focus:ring-2 focus:ring-[#009688]"
        />
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <BellIcon className="w-6 h-6 text-gray-500 hover:text-[#009688]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40?u=admin"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">مدير سيستم</p>
            <p className="text-xs text-gray-500">شرکت سه نيک</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
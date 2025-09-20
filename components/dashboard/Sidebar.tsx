import React from 'react';
import { HomeIcon, UsersIcon, ChartBarIcon, VideoCameraIcon, CogIcon, ArrowUturnLeftIcon, SenikLogo, DatabaseIcon, PaintBrushIcon } from '../Icons';
import type { DashboardViewType } from '../../types';

interface SidebarProps {
  activeView: DashboardViewType;
  setActiveView: (view: DashboardViewType) => void;
  setView: (view: 'homepage' | 'login' | 'dashboard') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, setView }) => {
  const navItems = [
    { name: 'داشبورد', view: 'dashboard', icon: HomeIcon },
    { name: 'کاربران', view: 'users', icon: UsersIcon },
    { name: 'گزارشات فروش', view: 'reports', icon: ChartBarIcon },
    { name: 'آموزش‌ها', view: 'tutorials', icon: VideoCameraIcon },
    { name: 'داده هاي سایت', view: 'siteData', icon: DatabaseIcon },
    { name: 'قالب سایت', view: 'theme', icon: PaintBrushIcon },
    { name: 'تنظيمات', view: 'settings', icon: CogIcon },
  ];

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    setView('homepage');
  };

  return (
    <aside className="w-64 bg-[#263238] text-white flex flex-col flex-shrink-0">
      <div className="h-20 flex items-center justify-center px-4 border-b border-white/10">
        <SenikLogo className="w-8 h-8 ml-3 text-white" />
        <h1 className="text-xl font-bold">پنل مدیریت سه نیک</h1>
      </div>
      <nav className="flex-grow px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveView(item.view as DashboardViewType);
            }}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeView === item.view
                ? 'bg-white text-gray-800 font-bold'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 ml-3" />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-white/10">
        <a href="#" onClick={handleLogout} className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors duration-200">
          <ArrowUturnLeftIcon className="w-5 h-5 ml-3" />
          <span>خروج و بازگشت به سایت</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
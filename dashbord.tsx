import React, { useState, useEffect } from 'react';
import type { DashboardViewType } from './types';
import Sidebar from './components/dashboard/Sidebar';
import DashboardHeader from './components/dashboard/DashboardHeader';
import DashboardView from './components/dashboard/views/DashboardView';
import UsersView from './components/dashboard/views/UsersView';
import ReportsView from './components/dashboard/views/ReportsView';
import TutorialsView from './components/dashboard/views/TutorialsView';
import SettingsView from './components/dashboard/views/SettingsView';
import SiteDataView from './components/dashboard/views/SiteDataView';
import SiteSazApp from './sitesaz/App';
import ThemeView from './components/dashboard/views/ThemeView';
import type { SiteContent, NavLink, Sublink } from './siteData';

interface DashboardProps {
  setView: (view: 'homepage' | 'login' | 'dashboard') => void;
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent | null>>;
  onNavigateFromDashboard: (page: NavLink | Sublink) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, siteContent, setSiteContent, onNavigateFromDashboard }) => {
  const [activeView, setActiveView] = useState<DashboardViewType>('siteData');
  const [editableContent, setEditableContent] = useState<SiteContent>(siteContent);
  const [editingPage, setEditingPage] = useState<NavLink | Sublink | null>(null);
  const [editingPagePath, setEditingPagePath] = useState<string | null>(null);


  useEffect(() => {
    setEditableContent(siteContent);
  }, [siteContent]);

  const handleSaveChanges = async (contentToSave: SiteContent): Promise<boolean> => {
    try {
      localStorage.setItem('siteContent', JSON.stringify(contentToSave));
      setSiteContent(contentToSave); // This will trigger the reactive theme effect in App.tsx
      await new Promise(resolve => setTimeout(resolve, 300));
      return true;
    } catch (error) {
      console.error("Save failed:", error);
      alert('خطا در ذخیره تغییرات. لطفاً کنسول را برای جزئیات بیشتر بررسی کنید.');
      return false;
    }
  };
  
  const handlePageSaveAndPersist = async (newContent: string): Promise<{ success: boolean; page?: NavLink | Sublink }> => {
    if (!editingPagePath) return { success: false };

    const newContentState = JSON.parse(JSON.stringify(editableContent));
    
    // This is a simplified path traversal. A robust solution would use a library like lodash.set
    let current: any = newContentState;
    const keys = editingPagePath.split('.');
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // Check if the key is an array index
        const arrayIndex = parseInt(key, 10);
        if (!isNaN(arrayIndex) && Array.isArray(current)) {
            current = current[arrayIndex];
        } else {
            current = current[key];
        }
    }

    const lastKey = keys[keys.length - 1];
    const lastKeyIndex = parseInt(lastKey, 10);
     if (!isNaN(lastKeyIndex) && Array.isArray(current)) {
        if(current[lastKeyIndex]) {
            current[lastKeyIndex].content = newContent;
        }
    } else {
       if(current[lastKey]) {
            current[lastKey].content = newContent;
        }
    }
    
    setEditableContent(newContentState);
    const updatedPage = editingPage ? { ...editingPage, content: newContent } : undefined;
    if (editingPage) {
        setEditingPage(updatedPage);
    }
    
    const success = await handleSaveChanges(newContentState);
    return { success, page: updatedPage };
  };

  if (activeView === 'pageEditor') {
    if (editingPage && editingPagePath) {
      return <SiteSazApp 
        onBack={() => {
          setActiveView('siteData');
          setEditingPage(null);
          setEditingPagePath(null);
        }}
        siteContent={editableContent}
        pageData={editingPage}
        onPageSave={handlePageSaveAndPersist}
        onNavigateFromDashboard={onNavigateFromDashboard}
      />;
    }
    // Fallback to siteData view if something is wrong
    setActiveView('siteData');
    return null;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'users':
        return <UsersView />;
      case 'reports':
        return <ReportsView />;
      case 'tutorials':
        return <TutorialsView />;
      case 'settings':
        return <SettingsView />;
      case 'siteData':
        return <SiteDataView 
                content={editableContent} 
                setContent={setEditableContent} 
                onSave={() => handleSaveChanges(editableContent)} 
                setActiveView={setActiveView}
                setEditingPage={setEditingPage}
                setEditingPagePath={setEditingPagePath}
                />;
      case 'theme':
        return <ThemeView
                content={editableContent}
                setContent={setEditableContent}
                onSave={() => handleSaveChanges(editableContent)}
                />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      <Sidebar activeView={activeView} setActiveView={setActiveView} setView={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className={`bg-gray-100 flex-1 overflow-x-hidden ${activeView === 'siteData' || activeView === 'theme' ? 'overflow-y-hidden' : 'p-6 overflow-y-auto'}`}>
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
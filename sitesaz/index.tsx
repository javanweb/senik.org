import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// FIX: Import mock data to satisfy App's required props for standalone testing.
import { siteContent } from '../siteData';
import type { NavLink, Sublink } from '../siteData';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// FIX: Provide mock props for the App component as it is being rendered standalone here.
// In the main application, these props are passed from the dashboard.
const mockPageData = siteContent.header.navLinks[0] ?? { name: 'Mock Page', href: '/', content: '[]' };
// FIX: Correct the return type of mockOnPageSave to match the component's prop type.
const mockOnPageSave = async (content: string): Promise<{ success: boolean; page?: NavLink | Sublink; }> => {
  console.log('Page content saved (mock):', content);
  return { success: true, page: { ...mockPageData, content } };
};

const mockOnNavigateFromDashboard = (page: NavLink | Sublink) => {
  console.log('Mock navigate from dashboard to:', page.name);
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App 
      siteContent={siteContent}
      pageData={mockPageData}
      onPageSave={mockOnPageSave}
      onNavigateFromDashboard={mockOnNavigateFromDashboard}
    />
  </React.StrictMode>
);

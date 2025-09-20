import React, { useState, useCallback, useEffect } from 'react';
import { CanvasElement, WidgetType } from './types';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import SettingsPanel from './components/SettingsPanel';
import { getWidgetDefaultSettings } from './utils/defaults';
import { SiteContent, NavLink, Sublink } from '../../siteData';

interface SiteSazAppProps {
  onBack?: () => void;
  siteContent: SiteContent;
  pageData: NavLink | Sublink;
  onPageSave: (newContent: string) => Promise<{ success: boolean; page?: NavLink | Sublink }>;
  onNavigateFromDashboard: (page: NavLink | Sublink) => void;
}

const App: React.FC<SiteSazAppProps> = ({ onBack, siteContent, pageData, onPageSave, onNavigateFromDashboard }) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    const isJsonString = (str: string | undefined): str is string => {
      if (typeof str !== 'string' || !str) return false;
      try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed);
      } catch (e) { return false; }
    };

    const content = pageData.content;
    if (content && isJsonString(content)) {
      setElements(JSON.parse(content));
    } else {
      const defaultElements: CanvasElement[] = [
        {
          id: `heading-${Date.now()}`,
          type: 'widget',
          widgetType: 'heading',
          settings: getWidgetDefaultSettings('heading'),
          children: [],
        }
      ];
      if (defaultElements[0].settings.content) {
        defaultElements[0].settings.content.title = pageData.name;
      }
      setElements(defaultElements);
    }
  }, [pageData]);
  
  const findElementRecursive = (elements: CanvasElement[], id: string): CanvasElement | null => {
      for (const element of elements) {
          if (element.id === id) return element;
          if (element.children.length > 0) {
              const found = findElementRecursive(element.children, id);
              if (found) return found;
          }
      }
      return null;
  }

  const selectedElement = selectedElementId ? findElementRecursive(elements, selectedElementId) : null;
  
  const handleAddSection = useCallback(() => {
    const newColumn: CanvasElement = {
      id: `column-${Date.now()}`,
      type: 'column',
      settings: {},
      children: [],
    };
    const newSection: CanvasElement = {
      id: `section-${Date.now()}`,
      type: 'section',
      settings: {},
      children: [newColumn],
    };
    setElements(prev => [...prev, newSection]);
  }, []);

  const addWidgetRecursive = (elements: CanvasElement[], parentId: string, newWidget: CanvasElement): CanvasElement[] => {
      return elements.map(el => {
          if (el.id === parentId) {
              if (el.type === 'column' || el.widgetType === 'container') {
                return { ...el, children: [...el.children, newWidget] };
              }
          }
          if (el.children?.length > 0) {
              return { ...el, children: addWidgetRecursive(el.children, parentId, newWidget) };
          }
          return el;
      });
  };

  const handleAddWidget = useCallback((parentId: string, widgetType: WidgetType) => {
    const newWidget: CanvasElement = {
      id: `${widgetType}-${Date.now()}`,
      type: 'widget',
      widgetType,
      settings: getWidgetDefaultSettings(widgetType),
      children: [],
    };

    if (widgetType === 'inner-section' && newWidget.settings.content.columns) {
        const columns = Array.from({ length: newWidget.settings.content.columns }, (_, i) => ({
            id: `column-${Date.now()}-${i}`,
            type: 'column' as const,
            settings: {},
            children: [],
        }));
        newWidget.children = columns;
    }

    setElements(prev => addWidgetRecursive(prev, parentId, newWidget));
    setSelectedElementId(newWidget.id);
  }, []);

  const handleSelectElement = useCallback((id: string | null) => {
    setSelectedElementId(id);
  }, []);

  const updateElementRecursive = (elements: CanvasElement[], id: string, updater: (element: CanvasElement) => CanvasElement): CanvasElement[] => {
      return elements.map(el => {
          if (el.id === id) {
              return updater(el);
          }
          if (el.children.length > 0) {
              return { ...el, children: updateElementRecursive(el.children, id, updater) };
          }
          return el;
      });
  };

  const handleUpdateElementSettings = useCallback((id: string, newSettings: { [key: string]: any }) => {
    setElements(prev => updateElementRecursive(prev, id, el => ({ ...el, settings: newSettings })));
  }, []);

  const deleteElementRecursive = (elements: CanvasElement[], id: string): CanvasElement[] => {
      return elements.filter(el => el.id !== id).map(el => {
          if (el.children.length > 0) {
              return { ...el, children: deleteElementRecursive(el.children, id) };
          }
          return el;
      });
  };

  const handleDeleteElement = useCallback((id: string) => {
      setElements(prev => deleteElementRecursive(prev, id));
      if (selectedElementId === id) {
          setSelectedElementId(null);
      }
  }, [selectedElementId]);

  const duplicateElementGenerator = (element: CanvasElement): CanvasElement => {
    const newId = `${element.widgetType || element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const duplicatedElement = JSON.parse(JSON.stringify(element));
    duplicatedElement.id = newId;
    if (duplicatedElement.children && duplicatedElement.children.length > 0) {
      duplicatedElement.children = duplicatedElement.children.map(duplicateElementGenerator);
    }
    return duplicatedElement;
  }
  
  const duplicateElementRecursive = (elements: CanvasElement[], id: string): CanvasElement[] => {
    const newElements: CanvasElement[] = [];
    for (const el of elements) {
      if (el.id === id) {
        newElements.push(el);
        newElements.push(duplicateElementGenerator(el));
      } else {
         const newEl = {...el};
         if (newEl.children && newEl.children.length > 0) {
            newEl.children = duplicateElementRecursive(newEl.children, id);
         }
         newElements.push(newEl);
      }
    }
    return newElements;
  };
  
  const handleDuplicateElement = useCallback((id: string) => {
      setElements(prev => duplicateElementRecursive(prev, id));
  }, []);
  
  const handleSaveAndPublish = async () => {
    setSaveState('saving');
    const { success, page } = await onPageSave(JSON.stringify(elements));
    setSaveState(success ? 'saved' : 'error');
    if (success && page) {
      setTimeout(() => {
        onNavigateFromDashboard(page);
      }, 1000);
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (saveState === 'saved' || saveState === 'error') {
      timer = setTimeout(() => setSaveState('idle'), 3000);
    }
    return () => clearTimeout(timer);
  }, [saveState]);

  return (
    <div dir="rtl" className="h-screen w-full flex flex-col font-sans bg-gray-100">
      <TopBar onBack={onBack} onPublish={handleSaveAndPublish} saveState={saveState} />
      <div className="flex flex-grow overflow-hidden">
        {selectedElement ? (
          <SettingsPanel 
            key={selectedElement.id}
            element={selectedElement} 
            onClose={() => setSelectedElementId(null)}
            onUpdate={handleUpdateElementSettings}
          />
        ) : (
          <Sidebar />
        )}
        <Canvas
          elements={elements}
          selectedElementId={selectedElementId}
          onAddSection={handleAddSection}
          onAddWidget={handleAddWidget}
          onSelectElement={handleSelectElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          siteContent={siteContent}
        />
      </div>
    </div>
  );
};

export default App;

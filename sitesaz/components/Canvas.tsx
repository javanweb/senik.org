import React, { useState, forwardRef } from 'react';
import { CanvasElement, WidgetType } from '../types';
import RenderedWidget from './RenderedWidget';
import { PlusIcon, TrashIcon } from './icons';
import { Header } from '../../components/Header';
import Footer from '../../components/Footer';
import { SiteContent } from '../../siteData';


interface CanvasProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onAddSection: () => void;
  onAddWidget: (parentId: string, widgetType: WidgetType) => void;
  onSelectElement: (id: string | null) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  siteContent: SiteContent;
}

const WidgetDropZone: React.FC<{ onDrop: (widgetType: WidgetType) => void, isVisible?: boolean }> = ({ onDrop, isVisible = true }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    const widgetType = e.dataTransfer.getData('widgetType') as WidgetType;
    if (widgetType) {
      onDrop(widgetType);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`my-4 py-8 border-2 border-dashed rounded-md text-center transition-colors duration-200 ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
    >
      <p className="text-gray-500">ابزارک را اینجا بکشید</p>
    </div>
  );
};

const SectionPlaceholder: React.FC<{ onAddSection: () => void }> = ({ onAddSection }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
      <button onClick={onAddSection} className="flex items-center justify-center w-16 h-16 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors">
        <PlusIcon className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2}/>
      </button>
      <p className="mt-4 text-gray-500">برای شروع، بخش جدیدی اضافه کنید</p>
    </div>
  );
};

const ElementRenderer = forwardRef<HTMLDivElement, { element: CanvasElement } & Omit<CanvasProps, 'elements'>>((props, ref) => {
    const { element, selectedElementId, onSelectElement, onDeleteElement, onDuplicateElement, onAddWidget } = props;
    const isSelected = selectedElementId === element.id;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectElement(element.id);
    }

    if (element.type === 'section') {
        return (
            <div
                onClick={handleClick}
                className={`relative group my-4 p-2 border ${isSelected ? 'border-blue-500' : 'border-transparent hover:border-dashed hover:border-gray-400'}`}
            >
                 <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-8 hidden group-hover:flex items-center bg-gray-500 text-white rounded-t-md px-2 py-1 z-10" style={{ ...(isSelected && { display: 'flex' }) }}>
                    <span className="text-xs font-bold ml-2">بخش</span>
                    <button onClick={(e) => { e.stopPropagation(); props.onAddSection(); }} className="p-1 hover:bg-gray-600 rounded"><PlusIcon className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteElement(element.id); }} className="p-1 hover:bg-gray-600 rounded"><TrashIcon className="w-4 h-4" /></button>
                 </div>
                 <div className="flex gap-4">
                    {element.children.map(column => <ElementRenderer key={column.id} {...props} element={column} />)}
                 </div>
            </div>
        )
    }

    if (element.type === 'column') {
        return (
            <div 
                onClick={handleClick}
                className={`flex-1 p-2 border min-h-[100px] ${isSelected ? 'border-green-500' : 'border-transparent hover:border-dashed hover:border-green-300'}`}
            >
                {element.children.map(widget => <ElementRenderer key={widget.id} {...props} element={widget} />)}
                <WidgetDropZone onDrop={(widgetType) => onAddWidget(element.id, widgetType)} />
            </div>
        )
    }

    if (element.type === 'widget') {
        return <RenderedWidget
            element={element}
            {...props}
            onSelect={onSelectElement}
            onDelete={onDeleteElement}
            onDuplicate={onDuplicateElement}
            isSelected={isSelected}
            ElementRenderer={ElementRenderer}
        />;
    }

    return null;
});

const Canvas: React.FC<CanvasProps> = (props) => {
  const { elements, onAddSection, siteContent } = props;
  
  const handleCanvasClick = () => {
      props.onSelectElement(null);
  }

  return (
    <div className="flex-grow bg-[#F1F2F7] overflow-y-auto">
      <div className="mx-auto bg-white shadow-lg flex flex-col min-h-full w-full">
        <Header 
          setView={() => {}} 
          navLinks={siteContent.header.navLinks} 
          onNavigate={() => {}}
          onGoHome={() => {}}
          isEditorMode={true}
        />
        <main className="flex-grow" onClick={handleCanvasClick}>
          {elements.length === 0 ? (
            <div className="max-w-4xl mx-auto p-4"> {/* Keep placeholder centered */}
                <SectionPlaceholder onAddSection={onAddSection} />
            </div>
          ) : (
            <div> {/* No width constraint for elements */}
                {elements.map(element => (
                    <ElementRenderer key={element.id} {...props} element={element} />
                ))}
            </div>
          )}
        </main>
        <Footer content={siteContent.footer} isEditorMode={true} />
      </div>
    </div>
  );
};

export default Canvas;
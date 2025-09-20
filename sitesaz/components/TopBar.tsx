import React from 'react';

interface TopBarProps {
  onBack?: () => void;
  onPublish: () => void;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
}

const TopBar: React.FC<TopBarProps> = ({ onBack, onPublish, saveState }) => {
  const buttonState = {
    saving: { text: 'در حال ذخیره...', disabled: true, className: 'bg-yellow-500 cursor-not-allowed' },
    saved: { text: 'ذخیره شد!', disabled: true, className: 'bg-green-600' },
    error: { text: 'خطا در ذخیره', disabled: false, className: 'bg-red-600 hover:bg-red-700' },
    idle: { text: 'ذخیره اطلاعات', disabled: false, className: 'bg-green-500 hover:bg-green-600' }
  }[saveState];

  return (
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-4 z-20 flex-shrink-0">
      <div className="flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" title="Back to Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
            </svg>
          </button>
        )}
        <div className="text-xl font-bold text-gray-700">ویرایشگر صفحه</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onPublish}
          disabled={buttonState.disabled}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors w-32 ${buttonState.className}`}
        >
          {buttonState.text}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
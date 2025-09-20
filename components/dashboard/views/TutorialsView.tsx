import React, { useState, useRef } from 'react';
import type { Tutorial } from '../../../types';
import { PlusIcon, PencilIcon, TrashIcon } from '../../Icons';

const mockTutorials: Tutorial[] = [
  { id: 1, title: 'راهنمای نصب اولیه', description: 'آموزش گام به گام نصب و راه‌اندازی نرم‌افزار حسابداری سه نیک.', thumbnailUrl: 'https://via.placeholder.com/150/8D4A9E/FFFFFF?text=نصب' },
  { id: 2, title: 'معرفی بخش خزانه‌داری', description: 'آشنایی با امکانات و ویژگی‌های ماژول خزانه‌داری و مدیریت چک‌ها.', thumbnailUrl: 'https://via.placeholder.com/150/01D48F/FFFFFF?text=خزانه' },
  { id: 3, title: 'گزارشات فصلی', description: 'چگونگی تهیه و ارسال گزارشات خرید و فروش فصلی برای سازمان امور مالیاتی.', thumbnailUrl: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=گزارش' },
];

const TutorialsView: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [tutorials, setTutorials] = useState<Tutorial[]>(mockTutorials);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
        if (file.type.startsWith('image/')) setFileType('image');
        else if (file.type.startsWith('video/')) setFileType('video');
        else setFileType(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, description, file: fileInputRef.current?.files?.[0] });
    // In a real app, you would send this to a server.
    // Here we just log it and reset the form.
    setTitle('');
    setDescription('');
    setFilePreview(null);
    setFileType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsFormVisible(false);
    alert('آموزش جدید در کنسول لاگ شد.');
  };

  if (isFormVisible) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">افزودن آموزش جدید</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">عنوان</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#009688] focus:border-[#009688]" required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">توضیحات</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#009688] focus:border-[#009688]" required></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">آپلود فایل (ویدیو یا تصویر)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {filePreview ? (
                    <div>
                      {fileType === 'image' && <img src={filePreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />}
                      {fileType === 'video' && <video src={filePreview} controls className="mx-auto h-24 w-auto rounded-md" />}
                    </div>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#009688] hover:text-[#00796B] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#009688]"><p className="p-1">فایل خود را انتخاب کنید</p><input id="file-upload" ref={fileInputRef} name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,video/*" /></label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB or MP4</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={() => setIsFormVisible(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">انصراف</button>
            <button type="submit" className="px-4 py-2 bg-[#009688] text-white rounded-md hover:bg-[#00796B]">افزودن آموزش</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت آموزش‌ها</h1>
        <button onClick={() => setIsFormVisible(true)} className="flex items-center gap-2 px-4 py-2 bg-[#009688] text-white rounded-md hover:bg-[#00796B]">
          <PlusIcon className="w-5 h-5" />
          <span>افزودن آموزش جدید</span>
        </button>
      </div>
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {tutorials.map(tutorial => (
            <li key={tutorial.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <img src={tutorial.thumbnailUrl} alt={tutorial.title} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">{tutorial.title}</p>
                  <p className="text-sm text-gray-600">{tutorial.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full"><PencilIcon className="w-5 h-5" /></button>
                <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"><TrashIcon className="w-5 h-5" /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TutorialsView;
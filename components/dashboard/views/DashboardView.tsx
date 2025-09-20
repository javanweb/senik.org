import React from 'react';
import StatCard from '../shared/StatCard';
import { UsersIcon, VideoCameraIcon, CurrencyIcon, TreasuryIcon } from '../../Icons';

const salesData = [
  { name: 'فروردین', 'فروش': 4000000 },
  { name: 'اردیبهشت', 'فروش': 3000000 },
  { name: 'خرداد', 'فروش': 2000000 },
  { name: 'تیر', 'فروش': 2780000 },
  { name: 'مرداد', 'فروش': 1890000 },
  { name: 'شهریور', 'فروش': 2390000 },
];

const DashboardView: React.FC = () => {
  const Recharts = (window as any).Recharts;

  const renderChart = () => {
    if (!Recharts) {
      return (
        <div style={{ width: '100%', height: 300 }} className="flex items-center justify-center">
          <p className="text-gray-500">در حال بارگذاری نمودار...</p>
        </div>
      );
    }

    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

    return (
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={salesData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => new Intl.NumberFormat('fa-IR').format(value)} />
            <Tooltip
              formatter={(value: number) => [new Intl.NumberFormat('fa-IR').format(value) + ' تومان', 'فروش']}
              cursor={{ fill: 'rgba(0, 150, 136, 0.1)' }}
              wrapperStyle={{ fontFamily: 'Vazirmatn, sans-serif' }}
            />
            <Legend />
            <Bar dataKey="فروش" fill="#009688" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">خوش آمدید، مدیر!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="فروش نرم‌افزار" value="۲۶,۸۵۰,۰۰۰ تومان" percentage={5.27} Icon={CurrencyIcon} />
        <StatCard title="اشتراک‌های جدید" value="۳۵۰ کاربر" percentage={12.5} Icon={UsersIcon} />
        <StatCard title="ثبت‌نام در دوره" value="۸۲ نفر" percentage={-2.1} Icon={VideoCameraIcon} />
        <StatCard title="تیکت‌های پشتیبانی" value="۱۵ باز" percentage={-10.0} Icon={TreasuryIcon} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">فروش ماهانه نرم‌افزار</h2>
        {renderChart()}
      </div>
    </div>
  );
};

export default DashboardView;
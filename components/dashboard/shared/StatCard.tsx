import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '../../Icons';

interface StatCardProps {
  title: string;
  value: string;
  percentage: number;
  Icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, percentage, Icon }) => {
  const isPositive = percentage >= 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="bg-teal-100 p-3 rounded-full">
          <Icon className="w-6 h-6 text-teal-600" />
        </div>
      </div>
      <div className="flex items-center mt-4">
        <span className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
          <span className="mr-1">{Math.abs(percentage)}%</span>
        </span>
        <span className="text-xs text-gray-500 mr-2">نسبت به ماه گذشته</span>
      </div>
    </div>
  );
};

export default StatCard;
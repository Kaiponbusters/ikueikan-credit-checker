'use client';

import { CreditSummary as CreditSummaryType } from '../lib/types';
import { getProgressColor, getProgressPercentage } from '../lib/utils';

interface CategoryProgressProps {
  summary: CreditSummaryType;
}

export default function CategoryProgress({ summary }: CategoryProgressProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">カテゴリ別進捗</h3>
      <div className="space-y-4">
        {summary.categoryBreakdown.map((category) => (
          <div key={category.category} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-800">{category.category}</h4>
              <span className="text-sm text-gray-600">
                {category.completed + category.planned} / {category.required} 単位
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(category.completed, category.required)}`}
                style={{ width: `${getProgressPercentage(category.completed, category.required)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>履修済み: {category.completed}単位</span>
              <span>履修予定: {category.planned}単位</span>
              {category.remaining > 0 && (
                <span className="text-red-600 font-medium">
                  不足: {category.remaining}単位
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
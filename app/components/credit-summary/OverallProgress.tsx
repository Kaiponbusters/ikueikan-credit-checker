'use client';

import { Award, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { CreditSummary as CreditSummaryType } from '../../lib/types';
import { getProgressColor, getProgressPercentage } from '../../lib/utils';

interface OverallProgressProps {
  summary: CreditSummaryType;
}

export default function OverallProgress({ summary }: OverallProgressProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">総合進捗</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {summary.totalCompleted}
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" />
            履修済み単位
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {summary.totalPlanned}
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" />
            履修予定単位
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {summary.totalRequired}
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4" />
            卒業必要単位
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">総合進捗</span>
          <span className="text-sm text-gray-600">
            {summary.totalCompleted + summary.totalPlanned} / {summary.totalRequired} 単位
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(summary.totalCompleted, summary.totalRequired)}`}
            style={{ width: `${getProgressPercentage(summary.totalCompleted, summary.totalRequired)}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {getProgressPercentage(summary.totalCompleted, summary.totalRequired).toFixed(1)}% 完了
        </div>
      </div>

      {/* 卒業可能性 */}
      <div className={`p-4 rounded-lg border-2 ${summary.canGraduate ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center gap-2">
          {summary.canGraduate ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className={`font-medium ${summary.canGraduate ? 'text-green-800' : 'text-red-800'}`}>
            {summary.canGraduate ? '卒業要件を満たしています' : '卒業要件を満たしていません'}
          </span>
        </div>
      </div>
    </div>
  );
} 
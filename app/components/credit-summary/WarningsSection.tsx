'use client';

import { AlertCircle } from 'lucide-react';
import { CreditSummary as CreditSummaryType } from '../../lib/types';

interface WarningsSectionProps {
  summary: CreditSummaryType;
}

export default function WarningsSection({ summary }: WarningsSectionProps) {
  if (summary.warnings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-800">注意事項</h3>
      </div>
      <div className="space-y-3">
        {summary.warnings.map((warning, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg border-l-4 ${
              warning.severity === 'error' 
                ? 'bg-red-50 border-red-400' 
                : warning.severity === 'warning'
                ? 'bg-yellow-50 border-yellow-400'
                : 'bg-blue-50 border-blue-400'
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertCircle className={`w-4 h-4 mt-0.5 ${
                warning.severity === 'error' 
                  ? 'text-red-600' 
                  : warning.severity === 'warning'
                  ? 'text-yellow-600'
                  : 'text-blue-600'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  warning.severity === 'error' 
                    ? 'text-red-800' 
                    : warning.severity === 'warning'
                    ? 'text-yellow-800'
                    : 'text-blue-800'
                }`}>
                  {warning.message}
                </p>
                {warning.courses && warning.courses.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    関連科目: {warning.courses.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
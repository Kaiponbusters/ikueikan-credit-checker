'use client';

import { useMemo, useState } from 'react';
import { Award, TrendingUp, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Course, UserCourse, CreditSummary as CreditSummaryType } from '../lib/types';
import { 
  calculateCompletedCredits, 
  calculatePlannedCredits, 
  calculateCreditsByCategory, 
  calculateCreditsByDepartment, 
  calculateCreditsBySystem,
  getProgressColor,
  getProgressPercentage
} from '../lib/utils';

interface CreditSummaryProps {
  courses: Course[];
  userCourses: UserCourse[];
  summary: CreditSummaryType;
}

export default function CreditSummary({ courses, userCourses, summary }: CreditSummaryProps) {
  const categoryCredits = useMemo(() => calculateCreditsByCategory(courses, userCourses), [courses, userCourses]);
  const departmentCredits = useMemo(() => calculateCreditsByDepartment(courses, userCourses), [courses, userCourses]);
  const systemCredits = useMemo(() => calculateCreditsBySystem(courses, userCourses), [courses, userCourses]);
  
  const [expandedSystems, setExpandedSystems] = useState<Record<string, boolean>>({});

  const toggleSystemExpansion = (systemName: string) => {
    setExpandedSystems(prev => ({
      ...prev,
      [systemName]: !prev[systemName]
    }));
  };

  return (
    <div className="space-y-6">
      {/* 総合進捗 */}
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

      {/* カテゴリ別進捗 */}
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

      {/* 系別進捗 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">系別単位数</h3>
        <div className="space-y-4">
          {Object.entries(systemCredits)
            .sort(([a], [b]) => a.localeCompare(b, 'ja'))
            .map(([systemName, data]) => (
            <div key={systemName} className="border rounded-lg">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSystemExpansion(systemName)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800">{systemName}</h4>
                    {expandedSystems[systemName] ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      合計: {data.completed + data.planned}単位
                    </div>
                    <div className="text-xs text-gray-500">
                      履修済み: {data.completed} / 履修予定: {data.planned}
                    </div>
                  </div>
                </div>
              </div>
              
              {expandedSystems[systemName] && (
                <div className="border-t bg-gray-50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 履修済み科目 */}
                    {data.courses.completed.length > 0 && (
                      <div>
                        <h5 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          履修済み科目 ({data.courses.completed.length}科目)
                        </h5>
                        <div className="space-y-1">
                          {data.courses.completed.map(course => (
                            <div key={course.id} className="text-sm bg-white rounded p-2 border">
                              <div className="font-medium">{course.name}</div>
                              <div className="text-xs text-gray-600 flex justify-between">
                                <span>{course.instructor}</span>
                                <span className="font-medium text-green-600">{course.credits}単位</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 履修予定科目 */}
                    {data.courses.planned.length > 0 && (
                      <div>
                        <h5 className="font-medium text-blue-700 mb-2 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          履修予定科目 ({data.courses.planned.length}科目)
                        </h5>
                        <div className="space-y-1">
                          {data.courses.planned.map(course => (
                            <div key={course.id} className="text-sm bg-white rounded p-2 border">
                              <div className="font-medium">{course.name}</div>
                              <div className="text-xs text-gray-600 flex justify-between">
                                <span>{course.instructor}</span>
                                <span className="font-medium text-blue-600">{course.credits}単位</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 科目がない場合 */}
                    {data.courses.completed.length === 0 && data.courses.planned.length === 0 && (
                      <div className="col-span-2 text-center text-gray-500 py-4">
                        この系の科目はまだ履修・予定されていません
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {Object.keys(systemCredits).length === 0 && (
            <div className="text-center text-gray-500 py-8">
              履修・予定科目がありません
            </div>
          )}
        </div>
      </div>

      {/* 学部別単位数 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">学部別単位数</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(departmentCredits).map(([department, credits]) => (
            <div key={department} className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">{department}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>履修済み:</span>
                  <span className="font-medium text-green-600">{credits.completed}単位</span>
                </div>
                <div className="flex justify-between">
                  <span>履修予定:</span>
                  <span className="font-medium text-blue-600">{credits.planned}単位</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="font-medium">合計:</span>
                  <span className="font-bold">{credits.completed + credits.planned}単位</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 警告とアドバイス */}
      {summary.warnings.length > 0 && (
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
      )}
    </div>
  );
} 
'use client';

import { useMemo, useState } from 'react';
import { CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Course, UserCourse } from '../../lib/types';
import { calculateCreditsBySystem } from '../../lib/utils';

interface SystemProgressProps {
  courses: Course[];
  userCourses: UserCourse[];
}

export default function SystemProgress({ courses, userCourses }: SystemProgressProps) {
  const systemCredits = useMemo(() => calculateCreditsBySystem(courses, userCourses), [courses, userCourses]);
  const [expandedSystems, setExpandedSystems] = useState<Record<string, boolean>>({});

  const toggleSystemExpansion = (systemName: string) => {
    setExpandedSystems(prev => ({
      ...prev,
      [systemName]: !prev[systemName]
    }));
  };

  return (
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
  );
} 
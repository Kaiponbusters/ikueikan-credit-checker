'use client';

import { useMemo } from 'react';
import { Course, UserCourse } from '../lib/types';
import { calculateCreditsByDepartment } from '../lib/utils';

interface DepartmentProgressProps {
  courses: Course[];
  userCourses: UserCourse[];
}

export default function DepartmentProgress({ courses, userCourses }: DepartmentProgressProps) {
  const departmentCredits = useMemo(() => calculateCreditsByDepartment(courses, userCourses), [courses, userCourses]);

  return (
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
  );
} 
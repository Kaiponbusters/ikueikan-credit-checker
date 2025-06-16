'use client';

import { User, Calendar, Clock, Award, Plus, Check, BookOpen } from 'lucide-react';
import { Course, UserCourse } from '../../lib/types';
import { getCategoryColor, getStatusText } from '../../lib/utils';

interface CourseItemProps {
  course: Course;
  userCourse?: UserCourse;
  onAddCourse: (courseId: string, status: UserCourse['status']) => void;
  onRemoveCourse: (courseId: string) => void;
  onUpdateStatus: (courseId: string, status: UserCourse['status']) => void;
}

const getStatusIcon = (status: UserCourse['status']) => {
  switch (status) {
    case 'completed':
      return <Check className="w-4 h-4 text-green-600" />;
    case 'planned':
      return <BookOpen className="w-4 h-4 text-blue-600" />;
    default:
      return null;
  }
};

export default function CourseItem({ 
  course, 
  userCourse, 
  onAddCourse, 
  onRemoveCourse, 
  onUpdateStatus 
}: CourseItemProps) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900 flex-1">
              {course.name}
            </h3>
            <div className="flex items-center gap-2">
              {userCourse && getStatusIcon(userCourse.status)}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                {course.category}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>{course.credits}単位</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{course.year}年度</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.term}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>学部: {course.department}</span>
            {course.isRequired && (
              <span className="text-red-600 font-medium">必修科目</span>
            )}
          </div>

          {course.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {course.description}
            </p>
          )}

          {course.prerequisite && course.prerequisite.length > 0 && (
            <div className="mt-2 text-xs text-orange-600">
              前提科目: {course.prerequisite.join(', ')}
            </div>
          )}
        </div>

        <div className="ml-4 flex flex-col gap-2">
          {userCourse ? (
            <>
              <div className="text-xs text-gray-500 text-right">
                {getStatusText(userCourse.status)}
              </div>
              <select
                value={userCourse.status}
                onChange={(e) => onUpdateStatus(course.id, e.target.value as UserCourse['status'])}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="completed">履修済み</option>
                <option value="planned">履修予定</option>
                <option value="in-progress">履修中</option>
              </select>
              <button
                onClick={() => onRemoveCourse(course.id)}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                削除
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-1">
              <button
                onClick={() => onAddCourse(course.id, 'completed')}
                className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                <Check className="w-3 h-3" />
                履修済み
              </button>
              <button
                onClick={() => onAddCourse(course.id, 'planned')}
                className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                <Plus className="w-3 h-3" />
                履修予定
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
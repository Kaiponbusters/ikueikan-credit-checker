'use client';

import { useState } from 'react';
import { Book, User, Calendar, Clock, Award, Plus, Check, BookOpen } from 'lucide-react';
import { Course, UserCourse } from '../lib/types';
import { getUserCourseStatus } from '../lib/utils';

interface CourseListProps {
  courses: Course[];
  userCourses: UserCourse[];
  onAddCourse: (courseId: string, status: UserCourse['status']) => void;
  onRemoveCourse: (courseId: string) => void;
  onUpdateStatus: (courseId: string, status: UserCourse['status']) => void;
}

export default function CourseList({ 
  courses, 
  userCourses, 
  onAddCourse, 
  onRemoveCourse, 
  onUpdateStatus 
}: CourseListProps) {
  const [sortBy, setSortBy] = useState<'name' | 'instructor' | 'credits' | 'year' | 'term'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedCourses = [...courses].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'ja');
        break;
      case 'instructor':
        comparison = a.instructor.localeCompare(b.instructor, 'ja');
        break;
      case 'credits':
        comparison = a.credits - b.credits;
        break;
      case 'year':
        comparison = a.year - b.year;
        break;
      case 'term':
        const termOrder = ['前期', '後期', '通年', '集中'];
        comparison = termOrder.indexOf(a.term) - termOrder.indexOf(b.term);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '必修':
        return 'bg-red-100 text-red-800 border-red-200';
      case '選択必修':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case '選択':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  const getStatusText = (status: UserCourse['status']) => {
    switch (status) {
      case 'completed':
        return '履修済み';
      case 'planned':
        return '履修予定';
      case 'in-progress':
        return '履修中';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Book className="w-5 h-5" />
            科目一覧 ({courses.length}件)
          </h2>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>並び順：</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="name-asc">科目名 (昇順)</option>
              <option value="name-desc">科目名 (降順)</option>
              <option value="instructor-asc">教員名 (昇順)</option>
              <option value="instructor-desc">教員名 (降順)</option>
              <option value="credits-asc">単位数 (昇順)</option>
              <option value="credits-desc">単位数 (降順)</option>
              <option value="year-asc">開講年度 (昇順)</option>
              <option value="year-desc">開講年度 (降順)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {sortedCourses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Book className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>該当する科目が見つかりませんでした。</p>
            <p className="text-sm">検索条件を変更してお試しください。</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedCourses.map((course) => {
              const userCourse = getUserCourseStatus(course.id, userCourses);
              
              return (
                <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
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
            })}
          </div>
        )}
      </div>
    </div>
  );
} 
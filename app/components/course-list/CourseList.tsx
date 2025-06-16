'use client';

import { useState, useMemo } from 'react';
import { Book } from 'lucide-react';
import { Course, UserCourse } from '../../lib/types';
import { getUserCourseStatus, sortCourses } from '../../lib/utils';
import CourseListHeader from './CourseListHeader';
import CourseItem from './CourseItem';

interface CourseListProps {
  courses: Course[];
  userCourses: UserCourse[];
  onAddCourse: (courseId: string, status: UserCourse['status']) => void;
  onRemoveCourse: (courseId: string) => void;
  onUpdateStatus: (courseId: string, status: UserCourse['status']) => void;
}

type SortField = 'name' | 'instructor' | 'credits' | 'year' | 'term';
type SortOrder = 'asc' | 'desc';

export default function CourseList({ 
  courses, 
  userCourses, 
  onAddCourse, 
  onRemoveCourse, 
  onUpdateStatus 
}: CourseListProps) {
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // useMemoでソート処理を最適化
  const sortedCourses = useMemo(() => 
    sortCourses(courses, sortBy, sortOrder), 
    [courses, sortBy, sortOrder]
  );

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortBy(field);
    setSortOrder(order);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <CourseListHeader
        coursesCount={courses.length}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

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
              const userCourse = getUserCourseStatus(course.id, userCourses) || undefined;
              
              return (
                <CourseItem
                  key={course.id}
                  course={course}
                  userCourse={userCourse}
                  onAddCourse={onAddCourse}
                  onRemoveCourse={onRemoveCourse}
                  onUpdateStatus={onUpdateStatus}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 
'use client';

import { Book } from 'lucide-react';

type SortField = 'name' | 'instructor' | 'credits' | 'year' | 'term';
type SortOrder = 'asc' | 'desc';

interface CourseListHeaderProps {
  coursesCount: number;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export default function CourseListHeader({ 
  coursesCount, 
  sortBy, 
  sortOrder, 
  onSortChange 
}: CourseListHeaderProps) {
  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-') as [SortField, SortOrder];
    onSortChange(field, order);
  };

  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Book className="w-5 h-5" />
          科目一覧 ({coursesCount}件)
        </h2>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>並び順：</span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
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
  );
} 
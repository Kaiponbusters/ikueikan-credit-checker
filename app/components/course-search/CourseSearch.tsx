'use client';

import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { SearchFilter, Course } from '../../lib/types';
import { extractSystemFromCategory } from '../../lib/utils';
import BasicSearchFields from './BasicSearchFields';
import AdvancedSearchFields from './AdvancedSearchFields';
import SearchFormActions from './SearchFormActions';

interface CourseSearchProps {
  courses: Course[];
  onSearch: (filter: SearchFilter) => void;
  onReset: () => void;
}

export default function CourseSearch({ courses, onSearch, onReset }: CourseSearchProps) {
  const [filter, setFilter] = useState<SearchFilter>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 利用可能な系の一覧を取得
  const availableSystems = useMemo(() => {
    const systems = new Set<string>();
    courses.forEach(course => {
      systems.add(extractSystemFromCategory(course.category));
    });
    return Array.from(systems).sort((a, b) => a.localeCompare(b, 'ja'));
  }, [courses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filter);
  };

  const handleReset = () => {
    setFilter({});
    setShowAdvanced(false);
    onReset();
  };

  const updateFilter = (key: keyof SearchFilter, value: string | number | boolean) => {
    setFilter(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800">科目検索</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 基本検索 */}
        <BasicSearchFields filter={filter} onFilterUpdate={updateFilter} />

        {/* 詳細検索トグル */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <Filter className="w-4 h-4" />
            詳細検索
            {showAdvanced ? (
              <span className="text-xs">（非表示）</span>
            ) : (
              <span className="text-xs">（表示）</span>
            )}
          </button>
        </div>

        {/* 詳細検索 */}
        {showAdvanced && (
          <AdvancedSearchFields
            filter={filter}
            availableSystems={availableSystems}
            onFilterUpdate={updateFilter}
          />
        )}

        {/* アクションボタン */}
        <SearchFormActions onReset={handleReset} />
      </form>
    </div>
  );
} 
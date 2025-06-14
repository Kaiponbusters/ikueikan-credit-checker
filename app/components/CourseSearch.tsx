'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { SearchFilter, Course } from '../lib/types';
import { extractSystemFromCategory } from '../lib/utils';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              キーワード
            </label>
            <input
              type="text"
              value={filter.keyword || ''}
              onChange={(e) => updateFilter('keyword', e.target.value)}
              placeholder="科目名、教員名、説明文で検索"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              教員名
            </label>
            <input
              type="text"
              value={filter.instructor || ''}
              onChange={(e) => updateFilter('instructor', e.target.value)}
              placeholder="教員名で検索"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              開講年度
            </label>
            <select
              value={filter.year || ''}
              onChange={(e) => updateFilter('year', e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="">すべて</option>
              <option value="2025">2025年度</option>
              <option value="2024">2024年度</option>
              <option value="2023">2023年度</option>
            </select>
          </div>
        </div>

        {/* 詳細検索 */}
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

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                学期
              </label>
              <select
                value={filter.term || ''}
                onChange={(e) => updateFilter('term', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">すべて</option>
                <option value="前期">前期</option>
                <option value="後期">後期</option>
                <option value="通年">通年</option>
                <option value="集中">集中</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリ
              </label>
              <select
                value={filter.category || ''}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">すべて</option>
                <option value="必修">必修</option>
                <option value="選択必修">選択必修</option>
                <option value="選択">選択</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                系
              </label>
              <select
                value={filter.system || ''}
                onChange={(e) => updateFilter('system', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">すべて</option>
                {availableSystems.map(system => (
                  <option key={system} value={system}>{system}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                学部
              </label>
              <select
                value={filter.department || ''}
                onChange={(e) => updateFilter('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">すべて</option>
                <option value="全学共通">全学共通</option>
                <option value="人文学部">人文学部</option>
                <option value="社会科学部">社会科学部</option>
                <option value="情報学部">情報学部</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                単位数（最小）
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={filter.creditsMin || ''}
                onChange={(e) => updateFilter('creditsMin', e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                単位数（最大）
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={filter.creditsMax || ''}
                onChange={(e) => updateFilter('creditsMax', e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filter.isRequired || false}
                  onChange={(e) => updateFilter('isRequired', e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">必修科目のみ</span>
              </label>
            </div>
          </div>
        )}

        {/* ボタン */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Search className="w-4 h-4" />
            検索
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <X className="w-4 h-4" />
            リセット
          </button>
        </div>
      </form>
    </div>
  );
} 
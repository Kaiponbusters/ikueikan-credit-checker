'use client';

import { SearchFilter } from '../../lib/types';

interface AdvancedSearchFieldsProps {
  filter: SearchFilter;
  availableSystems: string[];
  onFilterUpdate: (key: keyof SearchFilter, value: string | number | boolean) => void;
}

export default function AdvancedSearchFields({ filter, availableSystems, onFilterUpdate }: AdvancedSearchFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          学期
        </label>
        <select
          value={filter.term || ''}
          onChange={(e) => onFilterUpdate('term', e.target.value)}
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
          onChange={(e) => onFilterUpdate('category', e.target.value)}
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
          onChange={(e) => onFilterUpdate('system', e.target.value)}
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
          onChange={(e) => onFilterUpdate('department', e.target.value)}
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
          onChange={(e) => onFilterUpdate('creditsMin', e.target.value ? Number(e.target.value) : '')}
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
          onChange={(e) => onFilterUpdate('creditsMax', e.target.value ? Number(e.target.value) : '')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        />
      </div>

      <div className="flex items-center">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filter.isRequired || false}
            onChange={(e) => onFilterUpdate('isRequired', e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">必修科目のみ</span>
        </label>
      </div>
    </div>
  );
} 
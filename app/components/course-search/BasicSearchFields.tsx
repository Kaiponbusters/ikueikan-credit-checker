'use client';

import { SearchFilter } from '../../lib/types';

interface BasicSearchFieldsProps {
  filter: SearchFilter;
  onFilterUpdate: (key: keyof SearchFilter, value: string | number | boolean) => void;
}

export default function BasicSearchFields({ filter, onFilterUpdate }: BasicSearchFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          キーワード
        </label>
        <input
          type="text"
          value={filter.keyword || ''}
          onChange={(e) => onFilterUpdate('keyword', e.target.value)}
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
          onChange={(e) => onFilterUpdate('instructor', e.target.value)}
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
          onChange={(e) => onFilterUpdate('year', e.target.value ? Number(e.target.value) : '')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        >
          <option value="">すべて</option>
          <option value="2025">2025年度</option>
          <option value="2024">2024年度</option>
          <option value="2023">2023年度</option>
        </select>
      </div>
    </div>
  );
} 
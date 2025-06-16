'use client';

import { Search, X } from 'lucide-react';

interface SearchFormActionsProps {
  onReset: () => void;
}

export default function SearchFormActions({ onReset }: SearchFormActionsProps) {
  return (
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
        onClick={onReset}
        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <X className="w-4 h-4" />
        リセット
      </button>
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Download, Upload, Settings } from 'lucide-react';
import CourseSearch from './components/CourseSearch';
import CourseList from './components/CourseList';
import CreditSummary from './components/CreditSummary';
import WarningAlert from './components/WarningAlert';
import { 
  Course, 
  UserCourse, 
  CourseStatus, 
  SearchCriteria,
  CreditSummary as CreditSummaryType,
  RequirementCheckResult
} from './lib/types';
import { StorageManager, courseHelpers } from './lib/storage';
import { RequirementChecker } from './lib/requirementChecker';
import { filterCourses, sortCourses, exportToCSV, downloadFile } from './lib/utils';
import coursesData from './lib/data/courses.json';

export default function HomePage() {
  const [courses] = useState<Course[]>(coursesData.courses as Course[]);
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [isJapaneseNative, setIsJapaneseNative] = useState(true);
  const [creditSummary, setCreditSummary] = useState<CreditSummaryType | null>(null);
  const [requirementCheck, setRequirementCheck] = useState<RequirementCheckResult | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const requirementChecker = new RequirementChecker(isJapaneseNative);

  // 初期データ読み込み
  useEffect(() => {
    const savedCourses = StorageManager.loadData();
    setUserCourses(savedCourses);
  }, []);

  // 履修情報が変更されたら再計算
  useEffect(() => {
    const summary = requirementChecker.calculateCredits(userCourses);
    const check = requirementChecker.checkGraduationRequirements(userCourses);
    setCreditSummary(summary);
    setRequirementCheck(check);
    
    // ローカルストレージに保存
    StorageManager.saveData(userCourses);
  }, [userCourses, isJapaneseNative]);

  // 検索処理
  const handleSearch = (criteria: SearchCriteria) => {
    const filtered = filterCourses(courses, criteria);
    setFilteredCourses(sortCourses(filtered));
  };

  // 検索クリア
  const handleClearSearch = () => {
    setFilteredCourses(sortCourses(courses));
  };

  // 履修情報更新
  const handleCourseUpdate = (courseId: string, status: CourseStatus[keyof CourseStatus]) => {
    const update: UserCourse = {
      courseId,
      status,
      year: new Date().getFullYear()
    };
    setUserCourses(prev => courseHelpers.updateUserCourse(prev, update));
  };

  // 履修情報削除
  const handleCourseRemove = (courseId: string) => {
    setUserCourses(prev => courseHelpers.removeUserCourse(prev, courseId));
  };

  // データエクスポート
  const handleExportData = () => {
    // CSV形式でエクスポート
    const csv = exportToCSV(courses, userCourses);
    downloadFile(csv, `育英館大学_履修状況_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // バックアップエクスポート
  const handleExportBackup = () => {
    const backup = StorageManager.exportData();
    downloadFile(backup, `育英館大学_履修データバックアップ_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  // データインポート
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        StorageManager.importData(content);
        setUserCourses(StorageManager.loadData());
        alert('データのインポートが完了しました。');
      } catch (error) {
        alert('データのインポートに失敗しました。正しいフォーマットのファイルを選択してください。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                育英館大学 単位管理システム
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 設定パネル */}
      {showSettings && (
        <div className="bg-yellow-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <span className="text-sm font-medium">母語設定:</span>
                  <select
                    value={isJapaneseNative ? 'japanese' : 'other'}
                    onChange={(e) => setIsJapaneseNative(e.target.value === 'japanese')}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="japanese">日本語母語者（語学系A）</option>
                    <option value="other">日本語非母語者（語学系B）</option>
                  </select>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  CSVエクスポート
                </button>
                <button
                  onClick={handleExportBackup}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  バックアップ
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer">
                  <Upload className="h-4 w-4" />
                  インポート
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 警告表示 */}
        {requirementCheck && (
          <WarningAlert
            missingRequired={requirementCheck.missingRequired}
            warnings={requirementCheck.warnings}
          />
        )}

        {/* 単位集計 */}
        {creditSummary && requirementCheck && (
          <CreditSummary
            summary={creditSummary}
            requirementCheck={requirementCheck}
            isJapaneseNative={isJapaneseNative}
          />
        )}

        {/* 科目検索 */}
        <CourseSearch
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />

        {/* 科目一覧 */}
        <CourseList
          courses={filteredCourses}
          userCourses={userCourses}
          onCourseUpdate={handleCourseUpdate}
          onCourseRemove={handleCourseRemove}
        />
      </main>

      {/* フッター */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            育英館大学 単位管理システム - 卒業要件は2025年度カリキュラムに基づいています
          </p>
        </div>
      </footer>
    </div>
  );
}
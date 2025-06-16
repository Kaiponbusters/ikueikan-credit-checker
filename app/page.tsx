'use client';

import { useState, useEffect, useMemo } from 'react';
import { GraduationCap, Download, Upload, RefreshCw } from 'lucide-react';
import CourseSearch from './components/CourseSearch';
import CourseList from './components/CourseList';
import CreditSummary from './components/CreditSummary';
import { Course, UserCourse, SearchFilter, CreditSummary as CreditSummaryType } from './lib/types';
import { filterCourses, sortCourses } from './lib/utils';
import { loadUserData, saveUserData, addUserCourse, removeUserCourse, updateUserCourseStatus, exportUserData, importUserData } from './lib/storage';
import { checkGraduationRequirements } from './lib/simpleRequirementChecker';

// サンプルデータのインポート
import coursesData from './lib/data/courses.json';
import requirementsData from './lib/data/requirements.json';

export default function Home() {
  const [courses] = useState<Course[]>(coursesData as Course[]);
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [currentFilter, setCurrentFilter] = useState<SearchFilter>({});
  const [isLoading, setIsLoading] = useState(true);

  // ローカルストレージからデータを読み込み
  useEffect(() => {
    const userData = loadUserData();
    setUserCourses(userData.courses);
    setIsLoading(false);
  }, []);

  // ユーザーコースが変更された時にローカルストレージに保存
  useEffect(() => {
    if (!isLoading) {
      const userData = {
        courses: userCourses,
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      };
      saveUserData(userData);
    }
  }, [userCourses, isLoading]);

  // 卒業要件チェック
  const creditSummary: CreditSummaryType = useMemo(() => {
    return checkGraduationRequirements(
      courses,
      userCourses,
      requirementsData.graduationRequirement,
      requirementsData.graduationRequirement.totalCredits
    );
  }, [courses, userCourses]);

  // 検索処理
  const handleSearch = (filter: SearchFilter) => {
    setCurrentFilter(filter);
    const filtered = filterCourses(courses, filter);
    setFilteredCourses(filtered);
  };

  // 検索リセット
  const handleResetSearch = () => {
    setCurrentFilter({});
    setFilteredCourses(courses);
  };

  // 科目追加
  const handleAddCourse = (courseId: string, status: UserCourse['status']) => {
    addUserCourse(courseId, status);
    const userData = loadUserData();
    setUserCourses(userData.courses);
  };

  // 科目削除
  const handleRemoveCourse = (courseId: string) => {
    removeUserCourse(courseId);
    const userData = loadUserData();
    setUserCourses(userData.courses);
  };

  // ステータス更新
  const handleUpdateStatus = (courseId: string, status: UserCourse['status']) => {
    updateUserCourseStatus(courseId, status);
    const userData = loadUserData();
    setUserCourses(userData.courses);
  };

  // データエクスポート
  const handleExport = () => {
    const data = exportUserData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ikueikan-credits-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // データインポート
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      if (importUserData(data)) {
        const userData = loadUserData();
        setUserCourses(userData.courses);
        alert('データのインポートが完了しました。');
      } else {
        alert('データのインポートに失敗しました。ファイル形式を確認してください。');
      }
    };
    reader.readAsText(file);
  };

  // シラバスからのデータ取得
  const handleFetchFromSyllabus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/scrape', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert(`シラバスから${data.count}件の科目情報を取得しました。`);
          // 実際の実装では、取得したデータを courses にマージする処理を追加
        } else {
          alert('シラバスからのデータ取得に失敗しました。');
        }
      }
    } catch (error) {
      console.error('Error fetching syllabus data:', error);
      alert('ネットワークエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">育英館大学</h1>
                <p className="text-sm text-gray-600">単位管理システム</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleFetchFromSyllabus}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                シラバス取得
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <Download className="w-4 h-4" />
                エクスポート
              </button>
              
              <label className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer text-sm">
                <Upload className="w-4 h-4" />
                インポート
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側: 検索・科目一覧 */}
          <div className="lg:col-span-2 space-y-6">
            <CourseSearch
              courses={courses}
              onSearch={handleSearch}
              onReset={handleResetSearch}
            />
            
            <CourseList
              courses={filteredCourses}
              userCourses={userCourses}
              onAddCourse={handleAddCourse}
              onRemoveCourse={handleRemoveCourse}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>

          {/* 右側: 単位集計・進捗 */}
          <div className="lg:col-span-1">
            <CreditSummary
              courses={courses}
              userCourses={userCourses}
              summary={creditSummary}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>育英館大学 単位管理システム</p>
            <p className="mt-1">卒業要件を確認し、計画的な履修を支援します。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
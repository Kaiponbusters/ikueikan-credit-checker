import { Course, UserCourse, SearchFilter } from "./types";

// Tailwind CSSクラスを結合するシンプルな関数
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// 科目データをフィルタリングする関数
export function filterCourses(courses: Course[], filter: SearchFilter): Course[] {
  return courses.filter(course => {
    // キーワード検索
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      const matchesName = course.name.toLowerCase().includes(keyword);
      const matchesInstructor = course.instructor.toLowerCase().includes(keyword);
      const matchesDescription = course.description?.toLowerCase().includes(keyword) || false;
      
      if (!matchesName && !matchesInstructor && !matchesDescription) {
        return false;
      }
    }

    // 教員名で検索
    if (filter.instructor) {
      if (!course.instructor.includes(filter.instructor)) {
        return false;
      }
    }

    // 開講年度で検索
    if (filter.year) {
      if (course.year !== filter.year) {
        return false;
      }
    }

    // 学期で検索
    if (filter.term) {
      if (course.term !== filter.term) {
        return false;
      }
    }

    // カテゴリで検索
    if (filter.category) {
      if (course.category !== filter.category) {
        return false;
      }
    }

    // 系で検索
    if (filter.system) {
      const systemName = extractSystemFromCategory(course.category);
      if (systemName !== filter.system) {
        return false;
      }
    }

    // 学部で検索
    if (filter.department) {
      if (course.department !== filter.department) {
        return false;
      }
    }

    // 単位数の範囲で検索
    if (filter.creditsMin !== undefined) {
      if (course.credits < filter.creditsMin) {
        return false;
      }
    }

    if (filter.creditsMax !== undefined) {
      if (course.credits > filter.creditsMax) {
        return false;
      }
    }

    // 必修科目フィルタ
    if (filter.isRequired !== undefined) {
      if (course.isRequired !== filter.isRequired) {
        return false;
      }
    }

    return true;
  });
}

// 履修ステータスのテキストを取得する関数
export function getStatusText(status: UserCourse['status']): string {
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
}

// ソート機能

type SortField = 'name' | 'instructor' | 'credits' | 'year' | 'term';
type SortOrder = 'asc' | 'desc';

// 科目配列をソートする関数
export function sortCourses(
  courses: Course[], 
  sortBy: SortField, 
  sortOrder: SortOrder
): Course[] {
  return [...courses].sort((a, b) => {
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
}

// ユーザーの履修状況を取得する関数
export function getUserCourseStatus(courseId: string, userCourses: UserCourse[]): UserCourse | null {
  return userCourses.find(uc => uc.courseId === courseId) || null;
}

// 履修済み科目の単位数を計算する関数
export function calculateCompletedCredits(courses: Course[], userCourses: UserCourse[]): number {
  return userCourses
    .filter(uc => uc.status === 'completed')
    .reduce((total, uc) => {
      const course = courses.find(c => c.id === uc.courseId);
      return total + (course ? course.credits : 0);
    }, 0);
}

// 履修予定科目の単位数を計算する関数
export function calculatePlannedCredits(courses: Course[], userCourses: UserCourse[]): number {
  return userCourses
    .filter(uc => uc.status === 'planned')
    .reduce((total, uc) => {
      const course = courses.find(c => c.id === uc.courseId);
      return total + (course ? course.credits : 0);
    }, 0);
}

// カテゴリ別の単位数を計算する関数
export function calculateCreditsByCategory(courses: Course[], userCourses: UserCourse[]): Record<string, { completed: number; planned: number }> {
  const result: Record<string, { completed: number; planned: number }> = {};

  userCourses.forEach(uc => {
    const course = courses.find(c => c.id === uc.courseId);
    if (!course) return;

    if (!result[course.category]) {
      result[course.category] = { completed: 0, planned: 0 };
    }

    if (uc.status === 'completed') {
      result[course.category].completed += course.credits;
    } else if (uc.status === 'planned') {
      result[course.category].planned += course.credits;
    }
  });

  return result;
}

// 学部別の単位数を計算する関数
export function calculateCreditsByDepartment(courses: Course[], userCourses: UserCourse[]): Record<string, { completed: number; planned: number }> {
  const result: Record<string, { completed: number; planned: number }> = {};

  userCourses.forEach(uc => {
    const course = courses.find(c => c.id === uc.courseId);
    if (!course || !course.department) return;

    if (!result[course.department]) {
      result[course.department] = { completed: 0, planned: 0 };
    }

    if (uc.status === 'completed') {
      result[course.department].completed += course.credits;
    } else if (uc.status === 'planned') {
      result[course.department].planned += course.credits;
    }
  });

  return result;
}

// カテゴリ名から系名を抽出する関数
export function extractSystemFromCategory(category: string): string {
  // カテゴリ名から英語部分を除去して系名のみを抽出
  // 例: "情報・メディア系(Information and Media)" → "情報・メディア系"
  const match = category.match(/^([^(]+)/);
  return match ? match[1].trim() : category;
}

// 系別の単位数を計算する関数
export function calculateCreditsBySystem(courses: Course[], userCourses: UserCourse[]): Record<string, { completed: number; planned: number; courses: { completed: Course[]; planned: Course[] } }> {
  const result: Record<string, { completed: number; planned: number; courses: { completed: Course[]; planned: Course[] } }> = {};

  userCourses.forEach(uc => {
    const course = courses.find(c => c.id === uc.courseId);
    if (!course) return;

    const systemName = extractSystemFromCategory(course.category);

    if (!result[systemName]) {
      result[systemName] = { 
        completed: 0, 
        planned: 0, 
        courses: { completed: [], planned: [] }
      };
    }

    if (uc.status === 'completed') {
      result[systemName].completed += course.credits;
      result[systemName].courses.completed.push(course);
    } else if (uc.status === 'planned') {
      result[systemName].planned += course.credits;
      result[systemName].courses.planned.push(course);
    }
  });

  return result;
}

// 系別の科目一覧を取得する関数
export function getCoursesBySystem(courses: Course[]): Record<string, Course[]> {
  const result: Record<string, Course[]> = {};

  courses.forEach(course => {
    const systemName = extractSystemFromCategory(course.category);
    
    if (!result[systemName]) {
      result[systemName] = [];
    }
    
    result[systemName].push(course);
  });

  return result;
}

// 必修科目の未履修チェック
export function getUncompletedRequiredCourses(courses: Course[], userCourses: UserCourse[]): Course[] {
  const completedCourseIds = userCourses
    .filter(uc => uc.status === 'completed')
    .map(uc => uc.courseId);

  return courses.filter(course => 
    course.isRequired && !completedCourseIds.includes(course.id)
  );
}

// 履修条件をチェックする関数
export function checkPrerequisites(course: Course, courses: Course[], userCourses: UserCourse[]): { met: boolean; missing: Course[] } {
  if (!course.prerequisite || course.prerequisite.length === 0) {
    return { met: true, missing: [] };
  }

  const completedCourseIds = userCourses
    .filter(uc => uc.status === 'completed')
    .map(uc => uc.courseId);

  const missingPrerequisites = course.prerequisite
    .filter(prereqId => !completedCourseIds.includes(prereqId))
    .map(prereqId => courses.find(c => c.id === prereqId))
    .filter(Boolean) as Course[];

  return {
    met: missingPrerequisites.length === 0,
    missing: missingPrerequisites
  };
}

// 成績をGPAに変換する関数（将来の拡張用）
export function gradeToGPA(grade: string): number {
  const gradeMap: Record<string, number> = {
    'S': 4.0,
    'A+': 3.7,
    'A': 3.3,
    'B+': 3.0,
    'B': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0
  };

  return gradeMap[grade] || 0.0;
}

// データのバージョンチェック
export function isDataVersionCompatible(version: string): boolean {
  const currentVersion = '1.0.0';
  // 簡単なバージョンチェック（実際にはsemverライブラリを使用することを推奨）
  return version === currentVersion;
}

// 日付フォーマット関数
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

// CSVエクスポート機能
export function exportToCSV(courses: Course[], userCourses: UserCourse[]): string {
  const headers = [
    '科目コード',
    '科目名',
    '科目名（英語）',
    '単位数',
    'カテゴリー',
    '配当年次',
    '開講時期',
    '担当教員',
    '必修',
    '履修状況',
    '備考'
  ];

  const rows = courses.map(course => {
    const userCourse = userCourses.find(uc => uc.courseId === course.id);
    const status = userCourse ? 
      (userCourse.status === 'completed' ? '履修済み' : '履修予定') : 
      '未履修';

    return [
      course.id,
      course.name,
      course.nameEn || '',
      course.credits.toString(),
      course.category,
      course.year.toString(),
      course.term,
      course.instructor,
      course.isRequired ? '必修' : '',
      status,
      course.notes || ''
    ];
  });

  // BOMを追加してExcelで文字化けしないようにする
  const BOM = '\uFEFF';
  const csvContent = BOM + [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => 
        // カンマや改行を含む場合はダブルクォートで囲む
        cell.includes(',') || cell.includes('\n') ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(',')
    )
  ].join('\n');

  return csvContent;
}

// ダウンロード処理
export function downloadFile(content: string, filename: string, mimeType: string = 'text/csv'): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ファイルサイズフォーマット
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// UI関連のヘルパー関数 - CreditSummaryコンポーネント用

// 進捗バーの色を取得する関数
export function getProgressColor(completed: number, required: number): string {
  const percentage = (completed / required) * 100;
  if (percentage >= 100) return 'bg-green-500';
  if (percentage >= 75) return 'bg-blue-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

// 進捗率を計算する関数
export function getProgressPercentage(completed: number, required: number): number {
  return Math.min(100, (completed / required) * 100);
}

// CourseList用のUIヘルパー関数

// 科目カテゴリに応じた色クラスを取得する関数
export function getCategoryColor(category: string): string {
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
}
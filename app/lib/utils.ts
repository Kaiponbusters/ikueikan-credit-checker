import { Course, SearchCriteria, UserCourse } from './types';

// 科目検索フィルタリング
export function filterCourses(courses: Course[], criteria: SearchCriteria): Course[] {
  return courses.filter(course => {
    // キーワード検索（科目名）
    if (criteria.keyword) {
      const keyword = criteria.keyword.toLowerCase();
      const nameMatch = course.name.toLowerCase().includes(keyword);
      const nameEnMatch = course.nameEn?.toLowerCase().includes(keyword) || false;
      const idMatch = course.id.toLowerCase().includes(keyword);
      
      if (!nameMatch && !nameEnMatch && !idMatch) {
        return false;
      }
    }

    // 教員名検索
    if (criteria.instructor) {
      const instructor = criteria.instructor.toLowerCase();
      if (!course.instructor.toLowerCase().includes(instructor)) {
        return false;
      }
    }

    // 配当年次フィルター
    if (criteria.year !== undefined) {
      if (course.year !== criteria.year && course.year !== 0) { // 0は全学年対象
        return false;
      }
    }

    // カテゴリーフィルター
    if (criteria.category) {
      if (course.category !== criteria.category) {
        return false;
      }
    }

    // 必修科目フィルター
    if (criteria.onlyRequired) {
      if (!course.isRequired) {
        return false;
      }
    }

    return true;
  });
}

// 科目のソート
export function sortCourses(courses: Course[], sortBy: 'year' | 'category' | 'name' = 'year'): Course[] {
  return [...courses].sort((a, b) => {
    switch (sortBy) {
      case 'year':
        // 年次でソート（年次が同じ場合は前期→後期の順）
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        const termOrder = { '前期': 1, '後期': 2, '通年': 3, '全': 4 };
        const aTermOrder = termOrder[a.term as keyof typeof termOrder] || 5;
        const bTermOrder = termOrder[b.term as keyof typeof termOrder] || 5;
        return aTermOrder - bTermOrder;
      
      case 'category':
        // カテゴリーでソート
        return a.category.localeCompare(b.category);
      
      case 'name':
        // 科目名でソート
        return a.name.localeCompare(b.name);
      
      default:
        return 0;
    }
  });
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

// 日付フォーマット
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

// ファイルサイズフォーマット
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
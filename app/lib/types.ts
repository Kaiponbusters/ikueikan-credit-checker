// 科目のカテゴリー定義
export const CourseCategories = {
    // 教養・情報メディア基礎科目
    HUMANITIES: '人文科学系',
    SOCIAL_SCIENCE: '社会科学系',
    NATURAL_SCIENCE: '自然科学系',
    LANGUAGE_A: '語学系A',
    LANGUAGE_B: '語学系B',
    HEALTH_SPORTS: '健康とスポーツ系',
    CAREER_DESIGN: 'キャリア・デザイン系',
    INFO_MEDIA: '情報・メディア系',
    // 専門科目
    MATH_INFO: '数理情報系',
    SOCIAL_INFO: '社会情報系',
    MEDIA_EXPRESSION: 'メディア表現系',
    GENERAL: '総合系',
    TEACHER_TRAINING: '教職課程'
  } as const;
  
  export type CourseCategory = typeof CourseCategories[keyof typeof CourseCategories];
  
  // 科目の履修状態
  export const CourseStatus = {
    NOT_TAKEN: 'not_taken',      // 未履修
    PLANNED: 'planned',           // 履修予定
    COMPLETED: 'completed'        // 履修済み
  } as const;
  
  export type CourseStatusType = typeof CourseStatus[keyof typeof CourseStatus];
  
  // 科目情報の型定義
  export interface Course {
    id: string;                   // 科目コード
    name: string;                 // 科目名
    nameEn?: string;              // 科目名（英語）
    credits: number;              // 単位数
    category: CourseCategory;     // カテゴリー
    subCategory?: string;         // サブカテゴリー
    year: number;                 // 配当年次
    term: string;                 // 開講時期（前期/後期/通年等）
    instructor: string;           // 担当教員
    isRequired: boolean;          // 必修科目かどうか
    campus?: string;              // 開講キャンパス
    notes?: string;               // 備考
    requirements?: string[];      // 資格要件
    department?: string;          // 学科
    description?: string;         // 科目説明
    prerequisite?: string[];     // 履修条件（科目ID）
  }
  
  // ユーザーの履修情報
  export interface UserCourse {
    courseId: string;
    status: 'completed' | 'planned' | 'in-progress'; // 履修済み、履修予定、履修中
    grade?: string; // 成績
    completedYear?: number; // 取得年度
    completedTerm?: string; // 取得学期
    notes?: string;               // メモ
  }
  
  // 卒業要件の型定義
  export interface GraduationRequirement {
    id: string;
    category: string; // 要件カテゴリ（必修、選択必修、選択など）
    name: string; // 要件名
    requiredCredits: number; // 必要単位数
    courses?: string[]; // 対象科目ID（必修科目の場合）
    conditions?: RequirementCondition[]; // 条件
  }
  
  export interface RequirementCondition {
    type: 'minimum_courses' | 'specific_courses' | 'category_credits';
    value: number | string[];
    description: string;
  }
  
  // 単位集計結果
  export interface CreditSummary {
    totalCompleted: number; // 取得済み単位
    totalPlanned: number; // 履修予定単位
    totalRequired: number; // 卒業必要単位
    categoryBreakdown: CategoryBreakdown[]; // カテゴリ別内訳
    warnings: Warning[]; // 警告
    canGraduate: boolean; // 卒業可能か
  }
  
  export interface CategoryBreakdown {
    category: string;
    completed: number;
    planned: number;
    required: number;
    remaining: number;
  }
  
  export interface Warning {
    type: 'missing_required' | 'insufficient_credits' | 'prerequisite_not_met';
    message: string;
    courses?: string[]; // 関連科目ID
    severity: 'error' | 'warning' | 'info';
  }
  
  // 卒業要件チェック結果
  export interface RequirementCheckResult {
    canGraduate: boolean;
    totalCredits: {
      current: number;
      required: number;
      isCompleted: boolean;
    };
    categoryChecks: CategoryCheck[];
    missingRequired: Course[];    // 未履修の必修科目
    warnings: string[];           // 警告メッセージ
  }
  
  export interface CategoryCheck {
    category: string;
    currentCredits: number;
    requiredCredits: number;
    minCredits: number;
    isCompleted: boolean;
    missingCredits: number;
    missingRequiredCourses: Course[];
  }
  
  // 検索条件
  export interface SearchCriteria {
    keyword?: string;             // キーワード（科目名）
    instructor?: string;          // 教員名
    year?: number;                // 配当年次
    category?: CourseCategory;    // カテゴリー
    onlyRequired?: boolean;       // 必修科目のみ
  }
  
  // 検索フィルター
  export interface SearchFilter {
    keyword?: string;
    instructor?: string;
    year?: number;
    term?: string;
    category?: string;
    system?: string;
    department?: string;
    creditsMin?: number;
    creditsMax?: number;
    isRequired?: boolean;
  }
  
  // APIレスポンス型
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp?: string;
  }
  
  // スクレイピング結果
  export interface ScrapedCourse {
    id?: string;
    name: string;
    instructor?: string;
    credits?: number;
    year?: number;
    term?: string;
    description?: string;
    category?: string;
    department?: string;
  }
  
  // ローカルストレージのデータ構造
  export interface UserData {
    courses: UserCourse[];
    lastUpdated: string;
    version: string;
  }
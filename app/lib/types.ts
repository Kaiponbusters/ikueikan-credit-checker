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
  }
  
  // ユーザーの履修情報
  export interface UserCourse {
    courseId: string;
    status: CourseStatusType;
    year?: number;                // 履修年度
    grade?: number;               // 成績（将来的な拡張用）
    notes?: string;               // メモ
  }
  
  // 卒業要件の型定義
  export interface GraduationRequirement {
    totalCredits: number;         // 総単位数
    categories: CategoryRequirement[];
  }
  
  export interface CategoryRequirement {
    category: string;
    subcategories?: SubcategoryRequirement[];
    minCredits: number;           // 最低必要単位数
    requiredCredits?: number;     // 必修単位数
    isRequired: boolean;          // カテゴリー自体が必修かどうか
  }
  
  export interface SubcategoryRequirement {
    name: string;
    minCredits?: number;
    requiredCredits?: number;
  }
  
  // 単位集計結果
  export interface CreditSummary {
    total: {
      completed: number;
      planned: number;
      all: number;
    };
    byCategory: {
      [key: string]: {
        completed: number;
        planned: number;
        required: number;
        min: number;
      };
    };
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
  
  // ローカルストレージのデータ構造
  export interface StorageData {
    version: string;              // データバージョン
    userId?: string;              // 将来的なユーザー識別用
    courses: UserCourse[];        // 履修情報
    lastUpdated: string;          // 最終更新日時
  }
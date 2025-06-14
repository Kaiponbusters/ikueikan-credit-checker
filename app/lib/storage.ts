import { UserCourse, StorageData } from './types';

const STORAGE_KEY = 'ikueikan-credit-checker';
const STORAGE_VERSION = '1.0.0';

export class StorageManager {
  // データの保存
  static saveData(courses: UserCourse[]): void {
    const data: StorageData = {
      version: STORAGE_VERSION,
      courses,
      lastUpdated: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
      throw new Error('データの保存に失敗しました。');
    }
  }

  // データの読み込み
  static loadData(): UserCourse[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const data: StorageData = JSON.parse(stored);
      
      // バージョンチェック（将来的な互換性のため）
      if (data.version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch. Migrating data...');
        // 必要に応じてデータ移行処理を実装
      }

      return data.courses || [];
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      return [];
    }
  }

  // データのエクスポート（バックアップ用）
  static exportData(): string {
    const data = this.loadData();
    const exportData = {
      version: STORAGE_VERSION,
      courses: data,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  }

  // データのインポート（復元用）
  static importData(jsonString: string): void {
    try {
      const importData = JSON.parse(jsonString);
      if (!importData.courses || !Array.isArray(importData.courses)) {
        throw new Error('Invalid import data format');
      }
      
      this.saveData(importData.courses);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('データのインポートに失敗しました。正しいフォーマットのJSONファイルを選択してください。');
    }
  }

  // データのクリア
  static clearData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw new Error('データのクリアに失敗しました。');
    }
  }

  // ストレージ使用量の確認
  static getStorageInfo(): { used: number; available: boolean } {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || '';
      const used = new Blob([data]).size;
      
      // ローカルストレージの一般的な制限（5MB）に対する使用率
      const limit = 5 * 1024 * 1024; // 5MB
      const available = used < limit * 0.9; // 90%未満なら利用可能
      
      return { used, available };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: true };
    }
  }
}

// 履修情報の操作ヘルパー関数
export const courseHelpers = {
  // 履修情報の追加・更新
  updateUserCourse: (courses: UserCourse[], update: UserCourse): UserCourse[] => {
    const index = courses.findIndex(c => c.courseId === update.courseId);
    if (index >= 0) {
      return [
        ...courses.slice(0, index),
        update,
        ...courses.slice(index + 1)
      ];
    }
    return [...courses, update];
  },

  // 履修情報の削除
  removeUserCourse: (courses: UserCourse[], courseId: string): UserCourse[] => {
    return courses.filter(c => c.courseId !== courseId);
  },

  // 履修状態の一括更新
  bulkUpdateStatus: (
    courses: UserCourse[], 
    courseIds: string[], 
    status: UserCourse['status']
  ): UserCourse[] => {
    return courses.map(course => 
      courseIds.includes(course.courseId) 
        ? { ...course, status } 
        : course
    );
  }
};
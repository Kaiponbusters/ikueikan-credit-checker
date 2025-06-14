import { UserData, UserCourse } from './types';
import { isDataVersionCompatible } from './utils';

const STORAGE_KEY = 'ikueikan-credit-checker';
const CURRENT_VERSION = '1.0.0';

// ローカルストレージからデータを取得
export function loadUserData(): UserData {
  if (typeof window === 'undefined') {
    // サーバーサイドレンダリング時の処理
    return {
      courses: [],
      lastUpdated: new Date().toISOString(),
      version: CURRENT_VERSION
    };
  }

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return createDefaultUserData();
    }

    const parsedData: UserData = JSON.parse(storedData);

    // バージョン互換性をチェック
    if (!isDataVersionCompatible(parsedData.version)) {
      console.warn('Data version incompatible, creating new data');
      return createDefaultUserData();
    }

    return parsedData;
  } catch (error) {
    console.error('Failed to load user data from localStorage:', error);
    return createDefaultUserData();
  }
}

// ローカルストレージにデータを保存
export function saveUserData(userData: UserData): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const dataToSave: UserData = {
      ...userData,
      lastUpdated: new Date().toISOString(),
      version: CURRENT_VERSION
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Failed to save user data to localStorage:', error);
    return false;
  }
}

// デフォルトのユーザーデータを作成
function createDefaultUserData(): UserData {
  return {
    courses: [],
    lastUpdated: new Date().toISOString(),
    version: CURRENT_VERSION
  };
}

// 履修科目を追加
export function addUserCourse(courseId: string, status: UserCourse['status']): boolean {
  const userData = loadUserData();
  
  // 既に存在する場合は更新
  const existingIndex = userData.courses.findIndex(uc => uc.courseId === courseId);
  
  if (existingIndex >= 0) {
    userData.courses[existingIndex].status = status;
  } else {
    const newUserCourse: UserCourse = {
      courseId,
      status
    };
    userData.courses.push(newUserCourse);
  }

  return saveUserData(userData);
}

// 履修科目を削除
export function removeUserCourse(courseId: string): boolean {
  const userData = loadUserData();
  userData.courses = userData.courses.filter(uc => uc.courseId !== courseId);
  return saveUserData(userData);
}

// 履修科目のステータスを更新
export function updateUserCourseStatus(courseId: string, status: UserCourse['status'], grade?: string, completedYear?: number, completedTerm?: string): boolean {
  const userData = loadUserData();
  const courseIndex = userData.courses.findIndex(uc => uc.courseId === courseId);
  
  if (courseIndex >= 0) {
    userData.courses[courseIndex].status = status;
    if (grade !== undefined) {
      userData.courses[courseIndex].grade = grade;
    }
    if (completedYear !== undefined) {
      userData.courses[courseIndex].completedYear = completedYear;
    }
    if (completedTerm !== undefined) {
      userData.courses[courseIndex].completedTerm = completedTerm;
    }
    return saveUserData(userData);
  }
  
  return false;
}

// 履修科目の一括更新
export function updateUserCourses(courses: UserCourse[]): boolean {
  const userData = loadUserData();
  userData.courses = courses;
  return saveUserData(userData);
}

// データをエクスポート
export function exportUserData(): string {
  const userData = loadUserData();
  return JSON.stringify(userData, null, 2);
}

// データをインポート
export function importUserData(jsonData: string): boolean {
  try {
    const importedData: UserData = JSON.parse(jsonData);
    
    // データの妥当性をチェック
    if (!importedData.courses || !Array.isArray(importedData.courses)) {
      throw new Error('Invalid data format');
    }

    // バージョンチェック
    if (importedData.version && !isDataVersionCompatible(importedData.version)) {
      console.warn('Imported data version is incompatible');
    }

    return saveUserData(importedData);
  } catch (error) {
    console.error('Failed to import user data:', error);
    return false;
  }
}

// データをリセット
export function resetUserData(): boolean {
  const defaultData = createDefaultUserData();
  return saveUserData(defaultData);
}

// データのバックアップを作成
export function createBackup(): string {
  const userData = loadUserData();
  const backup = {
    ...userData,
    backupDate: new Date().toISOString()
  };
  return JSON.stringify(backup, null, 2);
}

// バックアップからデータを復元
export function restoreFromBackup(backupData: string): boolean {
  try {
    const backup = JSON.parse(backupData);
    
    // バックアップデータの妥当性をチェック
    if (!backup.courses || !Array.isArray(backup.courses)) {
      throw new Error('Invalid backup format');
    }

    const userData: UserData = {
      courses: backup.courses,
      lastUpdated: backup.lastUpdated || new Date().toISOString(),
      version: backup.version || CURRENT_VERSION
    };

    return saveUserData(userData);
  } catch (error) {
    console.error('Failed to restore from backup:', error);
    return false;
  }
}

// ストレージの使用量を取得
export function getStorageUsage(): { used: number; available: number } {
  if (typeof window === 'undefined') {
    return { used: 0, available: 0 };
  }

  try {
    const used = JSON.stringify(loadUserData()).length;
    // LocalStorageの一般的な制限は約5MB
    const available = 5 * 1024 * 1024; // 5MB in bytes
    
    return { used, available };
  } catch (error) {
    console.error('Failed to get storage usage:', error);
    return { used: 0, available: 0 };
  }
}

// ストレージをクリア
export function clearStorage(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear storage:', error);
    return false;
  }
}
import { Course, UserCourse, CreditSummary, Warning } from './types';

// カテゴリ名のマッピング関数
function normalizeCategoryName(category: string): string {
  const categoryMappings: { [key: string]: string } = {
    '人文科学系(Humanities)': '人文科学系',
    '社会科学系(Social Science)': '社会科学系',
    '自然科学系(Natural Science)': '自然科学系',
    '語学系A(Language A)': '語学系A',
    '語学系B(Language B)': '語学系B',
    '健康とスポーツ系(Health and Sports)': '健康とスポーツ系',
    'キャリア・デザイン系(Career Design)': 'キャリア・デザイン系',
    '情報・メディア系(Information and Media)': '情報・メディア系',
    '教職課程(Teacher Training)': '教職課程',
    '数理情報系(Mathematical Information)': '数理情報系',
    '社会情報系(Social Information)': '社会情報系',
    'メディア表現系(Media Expression)': 'メディア表現系',
    '総合系(Comprehensive)': '総合系'
  };
  
  return categoryMappings[category] || category;
}

// requirements.jsonの実際の構造に合わせた型定義
interface RequirementCategory {
  category: string;
  minCredits: number;
  requiredCredits?: number;
  isRequired: boolean;
  subcategories?: RequirementSubcategory[];
}

interface RequirementSubcategory {
  name: string;
  minCredits: number;
  requiredCredits: number;
}

interface RequirementData {
  totalCredits: number;
  categories: RequirementCategory[];
}

export function checkGraduationRequirements(
  courses: Course[], 
  userCourses: UserCourse[], 
  requirements: RequirementData,
  totalRequiredCredits: number = 124
): CreditSummary {
  // 履修済み単位数を計算
  const completedCredits = userCourses
    .filter(uc => uc.status === 'completed')
    .reduce((total, uc) => {
      const course = courses.find(c => c.id === uc.courseId);
      return total + (course ? course.credits : 0);
    }, 0);

  // 履修予定単位数を計算
  const plannedCredits = userCourses
    .filter(uc => uc.status === 'planned')
    .reduce((total, uc) => {
      const course = courses.find(c => c.id === uc.courseId);
      return total + (course ? course.credits : 0);
    }, 0);

  const warnings: Warning[] = [];
  
  // 総単位数チェック
  if (completedCredits < totalRequiredCredits) {
    warnings.push({
      type: 'insufficient_credits',
      message: `卒業に必要な総単位数${totalRequiredCredits}単位に対して${totalRequiredCredits - completedCredits}単位不足しています`,
      severity: 'error'
    });
  }

  // 必修科目の未履修チェック
  const requiredCourses = courses.filter(c => c.isRequired === true);
  const completedCourseIds = userCourses
    .filter(uc => uc.status === 'completed')
    .map(uc => uc.courseId);

  const missingRequired = requiredCourses.filter(c => !completedCourseIds.includes(c.id));
  if (missingRequired.length > 0) {
    warnings.push({
      type: 'missing_required',
      message: `必修科目が${missingRequired.length}科目未履修です`,
      courses: missingRequired.map(c => c.id),
      severity: 'error'
    });
  }

  // カテゴリ別の内訳を計算
  const categoryBreakdown = requirements.categories.flatMap(category => {
    if (category.subcategories) {
      // サブカテゴリがある場合はサブカテゴリごとに計算
      return category.subcategories.map(subcat => {
        let completed = 0;
        let planned = 0;

        userCourses.forEach(uc => {
          const course = courses.find(c => c.id === uc.courseId);
          if (!course) return;

          // カテゴリ名でマッチング（正規化を使用）
          if (normalizeCategoryName(course.category) === subcat.name) {
            if (uc.status === 'completed') {
              completed += course.credits;
            } else if (uc.status === 'planned') {
              planned += course.credits;
            }
          }
        });

        const remaining = Math.max(0, subcat.requiredCredits - completed);
        
        if (remaining > 0 && subcat.requiredCredits > 0) {
          warnings.push({
            type: 'insufficient_credits',
            message: `${subcat.name}で${remaining}単位不足しています`,
            severity: 'warning'
          });
        }

        return {
          category: subcat.name,
          completed,
          planned,
          required: subcat.requiredCredits,
          remaining
        };
      });
    } else {
      // サブカテゴリがない場合は直接計算
      let completed = 0;
      let planned = 0;

      userCourses.forEach(uc => {
        const course = courses.find(c => c.id === uc.courseId);
        if (!course) return;

        // カテゴリ名でマッチング（正規化を使用）
        if (normalizeCategoryName(course.category) === category.category) {
          if (uc.status === 'completed') {
            completed += course.credits;
          } else if (uc.status === 'planned') {
            planned += course.credits;
          }
        }
      });

      const remaining = Math.max(0, (category.requiredCredits || category.minCredits) - completed);
      
      if (remaining > 0) {
        warnings.push({
          type: 'insufficient_credits',
          message: `${category.category}で${remaining}単位不足しています`,
          severity: category.isRequired ? 'error' : 'warning'
        });
      }

      return [{
        category: category.category,
        completed,
        planned,
        required: category.requiredCredits || category.minCredits,
        remaining
      }];
    }
  });

  const canGraduate = warnings.filter(w => w.severity === 'error').length === 0 && 
                     completedCredits >= totalRequiredCredits;

  return {
    totalCompleted: completedCredits,
    totalPlanned: plannedCredits,
    totalRequired: totalRequiredCredits,
    categoryBreakdown,
    warnings,
    canGraduate
  };
} 
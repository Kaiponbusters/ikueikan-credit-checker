import { 
    Course, 
    UserCourse, 
    CourseStatus,
    CreditSummary, 
    RequirementCheckResult,
    CategoryCheck,
    GraduationRequirement
  } from './types';
  import coursesData from './data/courses.json';
  import requirementsData from './data/requirements.json';
  
  export class RequirementChecker {
    private courses: Course[];
    private requirement: GraduationRequirement;
    private isJapaneseNative: boolean;
  
    constructor(isJapaneseNative: boolean = true) {
      this.courses = coursesData.courses as Course[];
      this.requirement = requirementsData.graduationRequirement as GraduationRequirement;
      this.isJapaneseNative = isJapaneseNative;
    }
  
    // 単位集計
    calculateCredits(userCourses: UserCourse[]): CreditSummary {
      const summary: CreditSummary = {
        total: { completed: 0, planned: 0, all: 0 },
        byCategory: {}
      };
  
      // カテゴリー別の要件を初期化
      this.requirement.categories.forEach(cat => {
        cat.subcategories?.forEach(subcat => {
          summary.byCategory[subcat.name] = {
            completed: 0,
            planned: 0,
            required: subcat.requiredCredits || 0,
            min: subcat.minCredits || 0
          };
        });
      });
  
      // ユーザーの履修情報を集計
      userCourses.forEach(userCourse => {
        const course = this.courses.find(c => c.id === userCourse.courseId);
        if (!course) return;
  
        // 語学系の処理（日本語母語者は語学系Aのみ、非母語者は語学系Bのみカウント）
        if (course.category === '語学系A' && !this.isJapaneseNative) return;
        if (course.category === '語学系B' && this.isJapaneseNative) return;
  
        const credits = course.credits;
        
        if (userCourse.status === CourseStatus.COMPLETED) {
          summary.total.completed += credits;
          if (summary.byCategory[course.category]) {
            summary.byCategory[course.category].completed += credits;
          }
        } else if (userCourse.status === CourseStatus.PLANNED) {
          summary.total.planned += credits;
          if (summary.byCategory[course.category]) {
            summary.byCategory[course.category].planned += credits;
          }
        }
      });
  
      summary.total.all = summary.total.completed + summary.total.planned;
      return summary;
    }
  
    // 卒業要件チェック
    checkGraduationRequirements(userCourses: UserCourse[]): RequirementCheckResult {
      const creditSummary = this.calculateCredits(userCourses);
      const result: RequirementCheckResult = {
        canGraduate: true,
        totalCredits: {
          current: creditSummary.total.completed,
          required: this.requirement.totalCredits,
          isCompleted: creditSummary.total.completed >= this.requirement.totalCredits
        },
        categoryChecks: [],
        missingRequired: [],
        warnings: []
      };
  
      // 総単位数チェック
      if (!result.totalCredits.isCompleted) {
        result.canGraduate = false;
        result.warnings.push(
          `総単位数が不足しています。あと${this.requirement.totalCredits - creditSummary.total.completed}単位必要です。`
        );
      }
  
      // カテゴリー別チェック
      this.requirement.categories.forEach(category => {
        const categoryCredits = this.calculateCategoryCredits(
          category.category, 
          creditSummary, 
          userCourses
        );
  
        const categoryCheck: CategoryCheck = {
          category: category.category,
          currentCredits: categoryCredits,
          requiredCredits: category.requiredCredits || 0,
          minCredits: category.minCredits,
          isCompleted: categoryCredits >= category.minCredits,
          missingCredits: Math.max(0, category.minCredits - categoryCredits),
          missingRequiredCourses: []
        };
  
        if (!categoryCheck.isCompleted) {
          result.canGraduate = false;
          result.warnings.push(
            `${category.category}の単位が不足しています。あと${categoryCheck.missingCredits}単位必要です。`
          );
        }
  
        result.categoryChecks.push(categoryCheck);
      });
  
      // 必修科目チェック
      const requiredCourses = this.courses.filter(c => c.isRequired);
      const userCourseIds = userCourses
        .filter(uc => uc.status === CourseStatus.COMPLETED || uc.status === CourseStatus.PLANNED)
        .map(uc => uc.courseId);
  
      requiredCourses.forEach(course => {
        // 語学系の必修は母語に応じて判定
        if (course.category === '語学系A' && !this.isJapaneseNative) return;
        if (course.category === '語学系B' && this.isJapaneseNative) return;
  
        if (!userCourseIds.includes(course.id)) {
          result.missingRequired.push(course);
          result.canGraduate = false;
        }
      });
  
      if (result.missingRequired.length > 0) {
        result.warnings.push(
          `必修科目が${result.missingRequired.length}科目未履修です。`
        );
      }
  
      // 各系から最低1科目の取得チェック（情報メディア基礎・教養科目）
      const basicCategories = [
        '人文科学系', '社会科学系', '自然科学系', 
        this.isJapaneseNative ? '語学系A' : '語学系B',
        '健康とスポーツ系', 'キャリア・デザイン系', '情報・メディア系'
      ];
  
      basicCategories.forEach(category => {
        if (creditSummary.byCategory[category]?.completed === 0 && 
            creditSummary.byCategory[category]?.planned === 0) {
          result.warnings.push(`${category}から最低1科目以上の履修が必要です。`);
          result.canGraduate = false;
        }
      });
  
      return result;
    }
  
    // カテゴリー別の単位数計算
    private calculateCategoryCredits(
      categoryName: string,
      creditSummary: CreditSummary,
      userCourses: UserCourse[]
    ): number {
      const category = this.requirement.categories.find(c => c.category === categoryName);
      if (!category) return 0;
  
      let totalCredits = 0;
      
      if (category.subcategories) {
        category.subcategories.forEach(subcat => {
          // 語学系の特別処理
          if ((subcat.name === '語学系A' && this.isJapaneseNative) ||
              (subcat.name === '語学系B' && !this.isJapaneseNative) ||
              (!subcat.name.includes('語学系'))) {
            totalCredits += creditSummary.byCategory[subcat.name]?.completed || 0;
          }
        });
      }
  
      return totalCredits;
    }
  
    // 必修科目の未履修リストを取得
    getMissingRequiredCourses(userCourses: UserCourse[]): Course[] {
      const completedOrPlannedIds = userCourses
        .filter(uc => uc.status === CourseStatus.COMPLETED || uc.status === CourseStatus.PLANNED)
        .map(uc => uc.courseId);
  
      return this.courses
        .filter(course => {
          // 必修科目でない場合はスキップ
          if (!course.isRequired) return false;
          
          // 語学系の必修は母語に応じて判定
          if (course.category === '語学系A' && !this.isJapaneseNative) return false;
          if (course.category === '語学系B' && this.isJapaneseNative) return false;
          
          // 未履修の必修科目
          return !completedOrPlannedIds.includes(course.id);
        });
    }
  
    // 推奨科目の提案
    getRecommendedCourses(userCourses: UserCourse[]): Course[] {
      const checkResult = this.checkGraduationRequirements(userCourses);
      const recommendations: Course[] = [];
  
      // 不足しているカテゴリーの科目を推奨
      checkResult.categoryChecks.forEach(check => {
        if (check.missingCredits > 0) {
          const categoryCourses = this.courses.filter(c => 
            c.category === check.category &&
            !userCourses.some(uc => uc.courseId === c.id)
          );
          recommendations.push(...categoryCourses.slice(0, 3)); // 各カテゴリー最大3科目
        }
      });
  
      return recommendations;
    }
  }
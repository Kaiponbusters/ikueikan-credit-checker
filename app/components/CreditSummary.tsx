'use client';

import { Course, UserCourse, CreditSummary as CreditSummaryType } from '../lib/types';
import OverallProgress from './OverallProgress';
import CategoryProgress from './CategoryProgress';
import SystemProgress from './SystemProgress';
import DepartmentProgress from './DepartmentProgress';
import WarningsSection from './WarningsSection';

interface CreditSummaryProps {
  courses: Course[];
  userCourses: UserCourse[];
  summary: CreditSummaryType;
}

export default function CreditSummary({ courses, userCourses, summary }: CreditSummaryProps) {
  return (
    <div className="space-y-6">
      <OverallProgress summary={summary} />
      <CategoryProgress summary={summary} />
      <SystemProgress courses={courses} userCourses={userCourses} />
      <DepartmentProgress courses={courses} userCourses={userCourses} />
      <WarningsSection summary={summary} />
    </div>
  );
} 
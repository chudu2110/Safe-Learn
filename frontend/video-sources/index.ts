import { UserRole } from '../types';
import { getThcsSections } from './thcs';
import { getThptSections } from './thpt';
import { getParentSections } from './parents';

export const getLessonSections = (role: UserRole, lessonId: number, title: string) => {
  if (role === UserRole.STUDENT_MS) return getThcsSections(lessonId, title) as any[];
  if (role === UserRole.STUDENT_HS) return getThptSections(lessonId, title) as any[];
  if (role === UserRole.PARENT) return getParentSections(lessonId, title) as any[];
  return getThcsSections(lessonId, title) as any[];
};


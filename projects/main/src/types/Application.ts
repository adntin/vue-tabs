import type ApplicationBelong from '@/constants/ApplicationBelong';
import type ApplicationPosition from '@/constants/ApplicationPosition';
import type ApplicationTarget from '@/constants/ApplicationTarget';
import type ApplicationType from '@/constants/ApplicationType';

export interface Application {
  /** 应用id */
  id: string;
  /** 应用名称 */
  name: string;
  /** 应用code */
  code: string;
  /** 应用图标 */
  icon: string;
  /** 应用路径 */
  path: string;
  /** 应用类型 */
  type: ApplicationType;
  /** 应用打开方式 */
  target: ApplicationTarget;
  /** 应用归属 */
  belong: ApplicationBelong;
  /** 应用位置 */
  position?: ApplicationPosition;
  /** 应用分类id */
  categoryId?: string;
  /** 应用分类名称 */
  categoryName?: string;
  /** 应用分类排序 */
  categorySort?: number;
  /** 应用排序 */
  appSort?: number;
}

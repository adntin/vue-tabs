import type { LayoutItem } from 'grid-layout-plus';

export interface Workbench {
  id: string;
  name: string;
  status: number;
  widgets: LayoutItem[];
}

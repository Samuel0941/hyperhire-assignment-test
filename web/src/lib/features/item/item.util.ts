import { ApiState } from "@/lib/redux.type";

export interface IItem {
  id: string;
  name: string;
  depth: number;
  parentId: string | null;
  menuId: string;
  items: any[];
}

export type ItemStateTypes = {
  createItem: ApiState<IItem | null>;
  editItem: ApiState<IItem | null>;
  deleteItem: ApiState<IItem | null>;
  items: ApiState<IItem[]>;
  item: ApiState<IItem | undefined>;

  cachedTreeItems: IItem[];
};
